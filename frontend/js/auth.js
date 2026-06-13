const express = require('express');
const router = express.Router();
const User = require('../models/User'); // 👈 Asire w liy enpòtasyon sa a la nèt!

/* =======================================================
   🟢 1. WOUT ENSRIPSYON (POST /api/auth/register)
======================================================= */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, shopName, shopAddress, shopPhone, nif, cin, mainCategory, payoutMethod, payoutDetails, paymentMethodChosen } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Imel sa a gen yon kont sou sit la deja!" });
        }

        const newUser = new User({
            name,
            email,
            password, // Yo rekòmande pou w hash modpas sa a ak bcrypt pita
            role
        });

        if (role === 'seller') {
            newUser.sellerProfile = {
                shopName, shopAddress, shopPhone, nif, cin, mainCategory, payoutMethod, payoutDetails
            };
            newUser.paymentStatus = 'pending';
        }

        // Sove nouvo itilizatè a nan MongoDB
        const savedUser = await newUser.save();
        
        // Voye ID itilizatè a bay frontend lan pou paj peman yo ka itilize l
        res.status(201).json({ 
            message: "Kont kreye ak siksè!", 
            userId: savedUser._id 
        });

    } catch (error) {
        console.error("Erè Enskripsyon:", error.message);
        res.status(500).json({ message: "Erè sèvè: " + error.message });
    }
});

/* =======================================================
   🔵 2. WOUT KONEKSYON / LOGIN (POST /api/auth/login)
======================================================= */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Tcheke si imel la nan MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email oswa Modpas sa a pa kòrèk!" });
        }

        // 2. Verifye si modpas la matche
        if (user.password !== password) {
            return res.status(400).json({ message: "Email oswa Modpas sa a pa kòrèk!" });
        }

        // 3. Voye done siksè yo bay frontend lan
        res.status(200).json({
            message: "Koneksyon reyisi! 🎉",
            token: "JWT-TOKEN-SIMULE-" + user._id, // Fo token pou sesyon lokal
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
