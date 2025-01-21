//pages/api/auth/signup.js
import supabase from "../../../utils/supabaseClient";
import crypto from "crypto";
import bcrypt from "bcrypt";


const validatePassword = (password) => {
    if (password.length < 6) {
        return "Password minimal harus 6 karakter.";
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
        return "Password harus ada huruf kapital, kecil, dan angka.";
    }
    return null; 
};


const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Format email tidak valid.";
    }
    return null; 
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { namaPegawai, nomorPegawai, email: rawEmail, password } = req.body;
    const email = rawEmail?.toLowerCase();

    try {
        
        if (!namaPegawai || !nomorPegawai || !email || !password) {
            return res.status(400).json({ message: "Semua field harus diisi." });
        }

        
        const emailError = validateEmail(email);
        if (emailError) {
            return res.status(400).json({ message: emailError });
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.status(400).json({ message: passwordError });
        }

        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        
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

            // Update data jika nomor pegawai sudah ada
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

            // Kirim OTP
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

        // Cek apakah email sudah terdaftar
        const { data: emailCheck, error: emailCheckError } = await supabase
            .from("users")
            .select("email_verified")
            .ilike("email", `%${email}%`);

        if (emailCheckError) {
            console.error("Error Email Check:", emailCheckError);
            return res.status(500).json({ message: 'Email yang Anda masukan telah terdaftar' });
        }

        if (emailCheck.some((entry) => entry.email_verified)) {
            return res.status(400).json({
                message: `Email yang Anda masukkan (${email}) telah terdaftar.`,
            });
        }

        // Insert data baru
        const userId = crypto.randomBytes(16).toString("hex");
        const { error: insertError } = await supabase.from("users").insert([{
            userId,
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

        // Kirim OTP
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
