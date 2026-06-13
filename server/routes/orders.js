const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Rele modèl Mongoose la ak O majiskil

/* =======================================================
   🟢 1. KREYE YON NOUVO KÒMAND (POST /api/orders)
======================================================= */
router.post('/', async (req, res) => {
    try {
        const { customer, items, total, paymentMethod } = req.body;

        if (!customer || !items || !total || !paymentMethod) {
            return res.status(400).json({ message: "Tout enfòmasyon kòmand lan obligatwa!" });
        }

        // Jenere yon ID kòmand inik tankou sa nou te fè nan checkout.js la
        const orderId = "ML-" + Math.floor(100000 + Math.random() * 900000);

        const newOrder = new Order({
            orderId,
            customer,
            items,
            total: parseFloat(total),
            paymentMethod,
            status: paymentMethod === 'cod' ? 'pending' : 'pending' // L ap rete pending jiskaske admin konfime tranzaksyon an
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);

    } catch (err) {
        console.error("❌ Erè nan kreyasyon kòmand MongoDB:", err.message);
        res.status(500).json({ message: err.message });
    }
});

/* =======================================================
   🔵 2. PRAN TOUT KÒMAND YO (GET /api/orders)
======================================================= */
router.get('/', async (req, res) => {
    try {
        // Pran tout kòmand yo nan MongoDB epi klase yo depi sou sa ki pi fre a
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
