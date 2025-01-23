import supabase from "../../../utils/supabaseClient";

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
  
    const { email: rawEmail } = req.body;
    const email = rawEmail?.toLowerCase();
  
    if (!email) {
      return res.status(400).json({ message: "Email harus diisi." });
    }
  
    const emailError = validateEmail(email);
    if (emailError) {
      return res.status(400).json({ message: emailError });
    }
  
    try {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("email_verified")
        .ilike("email", email)
        .single();
  
      if (userError) {
        console.error("Error fetching user:", userError);
        return res.status(500).json({ message: "Email invalid atau belum terverifikasi." });
      }
  
      if (!user) {
        return res
          .status(400)
          .json({ message: `Email ${email} tidak ditemukan.` });
      }
  
      if (!user.email_verified) {
        return res
          .status(400)
          .json({ message: `Email ${email} belum terverifikasi.` });
      }
  
      const { error: otpError } = await supabase.auth.signInWithOtp({ email });
  
      if (otpError) {
        console.error("Error sending OTP:", otpError);
        return res.status(500).json({
          message: `Gagal mengirim OTP ke email, ${otpError.message}.`,
        });
      }
  
      return res.status(200).json({
        message: `OTP berhasil dikirim ke email ${email}. Silakan cek kotak masuk Anda.`,
        redirectUrl: `/resetpassword?email=${email}`, // Redirect ke halaman reset password
      });
    } catch (err) {
      console.error("Server error:", err);
      return res.status(500).json({ message: "Email invalid atau belum terverifikasi." });
    }
  }