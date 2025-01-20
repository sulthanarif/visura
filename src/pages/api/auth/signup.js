import supabase from "../../../utils/supabaseClient"; // Import Supabase Client

import crypto from "crypto";
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const email = req.body.email.toLowerCase();

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { namaPegawai, nomorPegawai,  password } = req.body;

    try {
        if (!namaPegawai || !nomorPegawai || !email || !password) {
            return res.status(400).json({ message: "Semua field harus diisi." });
        }

        const { data: existingUser, error: nomorCheckError } = await supabase
            .from("users")
            .select("email, email_verified")
            .eq("nomor_pegawai", nomorPegawai)
            .single();

        if (nomorCheckError && nomorCheckError.code !== "PGRST116") {
            console.error("Error Nomor Pegawai:", nomorCheckError);
            return res.status(500).json({ message: "Terjadi kesalahan pada server." });
        }

        if (existingUser) {
            const { email: emailFromDB, email_verified: isVerified } = existingUser;

            if (isVerified) {
                return res.status(400).json({
                    message: `Nomor pegawai ${nomorPegawai} sudah terdaftar dengan email (${emailFromDB}).`,
                });
            }

            const { data: allEmailCheck, error: allEmailError } = await supabase
                .from("users")
                .select("email_verified")
                .ilike("email", `%${email}%`);

            if (allEmailError) {
                console.error("Error All Email Check:", allEmailError);
                return res.status(500).json({ message: "Terjadi kesalahan pada server." });
            }

            const isEmailVerifiedElsewhere = allEmailCheck.some((entry) => entry.email_verified);

            if (isEmailVerifiedElsewhere) {
                return res.status(400).json({
                    message: `Email yang Anda masukkan (${email}) telah terdaftar.`,
                });
            }

            const { error: updateError } = await supabase
                .from("users")
                .update({
                    nama_pegawai: namaPegawai,
                    email: email,
                    password: hashedPassword,
                    email_verified: false,
                })
                .eq("nomor_pegawai", nomorPegawai);

            if (updateError) {
                console.error("Error Updating Data:", updateError);
                return res.status(500).json({ message: "Gagal memperbarui data." });
            }

            // Kirim OTP untuk verifikasi ulang
            const { error: otpError } = await supabase.auth.signInWithOtp({ email });
            if (otpError) {
                console.error("Error Sending OTP:", otpError);
                return res.status(500).json({
                    message: `Gagal mengirim OTP, ${otpError.message}.`,
                });
            }

            return res.status(200).json({
                message: `Data berhasil diperbarui. Silakan cek email Anda (${email}).`,
                redirectUrl: `/otpsignupconfirmation?email=${email}&nomorPegawai=${nomorPegawai}`, 
            });
        }

        const { data: emailCheck, error: emailCheckError } = await supabase
            .from("users")
            .select("email_verified")
            .ilike("email", `%${email}%`);

        if (emailCheckError) {
            console.error("Error Email Check:", emailCheckError);
            return res.status(500).json({ message: "Terjadi kesalahan pada server." });
        }

        const isEmailVerified = emailCheck.some((entry) => entry.email_verified);

        if (isEmailVerified) {
            return res.status(400).json({
                message: `Email yang Anda masukkan (${email}) telah terdaftar.`,
            });
        }
        const userId = crypto.randomBytes(16).toString('hex');
        const { error: insertError } = await supabase.from("users").insert([{
            userId :userId,
            nama_pegawai: namaPegawai,
            nomor_pegawai: nomorPegawai,
            email: email,
            password: hashedPassword, 
            email_verified: false,
        }]);

        if (insertError) {
            console.error("Error Insert:", insertError);
            return res.status(500).json({ message: "Gagal melakukan pendaftaran." });
        }

        const { error: otpError } = await supabase.auth.signInWithOtp({ email });
        if (otpError) {
            console.error("Error Sending OTP:", otpError);
            return res.status(500).json({
                message: `Gagal mengirim OTP ke email, ${otpError.message}.`,
            });
        }

        return res.status(200).json({
            message: `Pendaftaran berhasil. Silakan cek email Anda (${email}).`,
            redirectUrl: `/otpsignupconfirmation?email=${email}&nomorPegawai=${nomorPegawai}`, 
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
}
