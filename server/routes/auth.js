const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Rele vrè modèl MongoDB a
const bcrypt = require('bcrypt'); // 👈 Enpòte bcrypt pou sekirite modpas yo
const nodemailer = require('nodemailer');

// Konfigirasyon Transpòtè Imel la (Mete vrè enfòmasyon .env ou yo)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/* =======================================================
   🟢 1. WOUT ENSRIPSYON AK KODAJ MODPAS (POST /api/auth/register)
======================================================= */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, shopName, shopAddress, shopPhone, nif, cin, mainCategory, payoutMethod, payoutDetails, paymentMethodChosen } = req.body;

        // 1. Validasyon rapid
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Tanpri ranpli tout jaden pèsonèl ki obligatwa yo!" });
        }

        // 2. Tcheke si imel sa a gen yon kont nan MongoDB deja
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Imel sa a gen yon kont sou sit la deja!" });
        }

        // 🚀 3. KODE MODPAS LA AK BCRYPT POU SEKIRITE (10 rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Jenere yon kòd 6 chif o aza pou OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // Valid pou 15 minit

        const newUser = new User({
            name, 
            email, 
            password: hashedPassword, // 👈 Sove modpas ki kode a pito
            role,
            otpCode: otp,
            otpExpires: otpExpires,
            isEmailVerified: false // L ap bezwen antre kòd 6 chif la an premye
        });

        if (role === 'seller') {
            newUser.sellerProfile = {
                shopName, shopAddress, shopPhone, nif, cin, mainCategory, payoutMethod, payoutDetails
            };
            newUser.paymentMethodChosen = paymentMethodChosen; // Sove rezo li chwazi a
            newUser.paymentStatus = 'pending';
        }

        const savedUser = await newUser.save();

        // 5. Voye Imel la ak kòd 6 chif la
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `${otp} se kòd verifikasyon Mache Lakay ou 🔑`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 25px; border-radius: 8px; text-align: center;">
                    <h2 style="color: #ff9900;">🛒 MACHE LAKAY</h2>
                    <p style="font-size: 16px;">Bonjou <b>${name}</b>, pou w finalize kreyasyon kont ou a, antre kòd sekirite sa a sou sit la:</p>
                    <div style="font-size: 32px; font-weight: bold; background: #f5f5f5; padding: 15px; margin: 20px auto; letter-spacing: 4px; color: #131921; display: inline-block; border-radius: 4px; border: 1px solid #ddd;">
                        ${otp}
                    </div>
                    <p style="color: #666; font-size: 13px;">Kòd sa a valid pou 15 minit sèlman. Pa pataje l ak pèsonn.</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) console.error("❌ Erè voye OTP:", err.message);
            else console.log(`📧 Kòd OTP (${otp}) pati pou ${email} byen pwòp!`);
        });

        res.status(201).json({ 
            message: "Kòd verifikasyon pati sou imel ou!", 
            userId: savedUser._id,
            email: savedUser.email
        });

    } catch (error) {
        console.error("❌ Erè Enskripsyon:", error.message);
        res.status(500).json({ message: "Erè sèvè: " + error.message });
    }
});

/* =======================================================
   🔑 2. WOUT VERIFIKASYON OTP (POST /api/auth/verify-otp)
======================================================= */
router.post('/verify-otp', async (req, res) => {
    try {
        const { userId, code } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Itilizatè pa jwenn!" });

        // Tcheke si kòd la matche
        if (user.otpCode !== code) {
            return res.status(400).json({ message: "❌ Kòd verifikasyon sa a pa kòrèk!" });
        }

        // Tcheke si kòd la ekspire
        if (new Date() > user.otpExpires) {
            return res.status(400).json({ message: "❌ Kòd sa a ekspire! Tanpri mande yon lòt." });
        }

        // Aktive imel moun lan nèt
        user.isEmailVerified = true;
        user.otpCode = undefined; 
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({
            message: "Koneksyon otomatik reyisi! 🎉",
            token: "JWT-TOKEN-REAL-" + user._id,
            role: user.role,
            name: user.name,
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* =======================================================
   🔵 3. WOUT KONEKSYON / LOGIN VERIFYE AK BCRYPT (POST /api/auth/login)
======================================================= */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Tanpri antre imel ou ak modpas ou!" });
        }

        // 1. Chèche itilizatè a nan MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email oswa Modpas sa a pa kòrèk!" });
        }

        // 🚀 2. VERIFYE MODPAS KODE A AK BCRYPT COMPARE
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email oswa Modpas sa a pa kòrèk!" });
        }

        // ⚠️ 3. Bloke moun lan si l potko mete kòd 6 chif la
        if (!user.isEmailVerified) {
            return res.status(400).json({ message: "⚠️ Ou dwe verifye imel ou an premye ak kòd 6 chif la!", userId: user._id });
        }

        res.status(200).json({
            message: "Koneksyon reyisi! 🎉",
            token: "JWT-TOKEN-REAL-" + user._id,
            role: user.role,
            name: user.name,
            userId: user._id
        });

    } catch (error) {
        console.error("❌ Erè backend nan login:", error.message);
        res.status(500).json({ message: "Erè sèvè: " + error.message });
    }
});

module.exports = router;
