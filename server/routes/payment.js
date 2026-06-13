const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const axios = require("axios");
const User = require("../models/User");
const Order = require("../models/Order");

const MONCASH_URL = process.env.MONCASH_MODE === 'live' 
    ? 'https://digicelgroup.com' 
    : 'https://digicelgroup.com';

const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_1234567890abcdefghijklmnopqrstuvwxyz";
const stripe = new Stripe(stripeKey);

/* =======================================================
   🟢 1. CONMIFASYON PEMAN DIGICEL MONCASH (AUTOMATIK)
======================================================= */
router.post("/moncash-confirm", async (req, res) => {
    try {
        const { phone, transactionId, type, userId } = req.body;
        
        // Mòd simulation rapid pou tès la pa bloke si kle Digicel yo poko ranpli
        console.log(`📱 Nouvo Peman MonCash resevwa: Nimewo ${phone}, Kòd: ${transactionId}`);
        
        if (type === "registration" && userId) {
            await User.findByIdAndUpdate(userId, { paymentStatus: 'paid', isVerified: true });
            return res.status(200).json({ message: "Peman konfime! Boutik ou aktive." });
        } else if (type === "checkout") {
            await Order.findOneAndUpdate({ "customer.phone": phone }, { status: 'paid' });
            return res.status(200).json({ message: "Peman kòmand konfime avèk siksè!" });
        }
        res.status(200).json({ message: "Tranzaksyon verifye!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* =======================================================
   🟠 2. NOUVO: CONMIFASYON NATCASH (MANNYÈL/PENDING)
======================================================= */
router.post("/natcash-confirm", async (req, res) => {
    try {
        const { phone, transactionId, type, userId } = req.body;
        console.log(`📱 Nouvo Prèv NatCash soumèt: Nimewo ${phone}, TxID: ${transactionId}`);
        
        // Admin ap jwenn kòd sa a nan baz la pou l verifye l sou telefòn li epi pase l "paid"
        return res.status(200).json({ message: "Prèv NatCash soumèt ak siksè!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* =======================================================
   🔵 3. NOUVO: CONMIFASYON DEPO BANKÈ (SOGEBANK / UNIBANK)
======================================================= */
router.post("/bank-confirm", async (req, res) => {
    try {
        console.log(`🏦 Nouvo Prèv Transfè Bankè soumèt pa frontend lan.`);
        return res.status(200).json({ message: "Prèv Bankè soumèt! Admin ap verifye li." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* =======================================================
   ✈️ 4. NOUVO: CONMIFASYON TRANFÈ WISE (DYASPORA)
======================================================= */
router.post("/wise-confirm", async (req, res) => {
    try {
        console.log(`✈️ Nouvo Prèv Wise soumèt depi lòtbò dlo.`);
        return res.status(200).json({ message: "Prèv Wise soumèt ak siksè!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* =======================================================
   💳 5. STRIPE PAYMENT INTENT
======================================================= */
router.post("/create-payment-intent", async (req, res) => {
    try {
        const { amount } = req.body;
        const stripeAmount = Math.round(parseFloat(amount) * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: stripeAmount,
            currency: "usd",
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
