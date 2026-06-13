const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');

/* =======================================================
   📊 1. PRAN TOUT VANDÈ KI AN ATANT (GET /api/admin/pending-sellers)
======================================================= */
router.get('/pending-sellers', async (req, res) => {
    try {
        // Chèche tout moun ki se vandè epi ki potko verifye nèt
        const pendingSellers = await User.find({ 
            role: 'seller', 
            isVerified: false 
        }).sort({ createdAt: -1 });
        
        res.status(200).json(pendingSellers);
    } catch (error) {
        res.status(500).json({ message: "Erè sèvè: " + error.message });
    }
});

/* =======================================================
   ✅ 2. APWOUVE AK AKTIVE YON VANDÈ (POST /api/admin/approve-seller)
======================================================= */
router.post('/approve-seller', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "ID itilizatè a obligatwa!" });
        }

        // Pase vandè a an mòd 'paid' ak 'isVerified: true' pou l ka kòmanse vann
        const updatedUser = await User.findByIdAndUpdate(userId, {
            paymentStatus: 'paid',
            isVerified: true
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "Vandè sa a pa egziste!" });
        }

        res.status(200).json({ 
            message: `🎉 Boutik "${updatedUser.sellerProfile.shopName}" aktive ak siksè nèt!`,
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ message: "Erè sèvè nan apwobasyon: " + error.message });
    }
});

/* =======================================================
   📈 3. PRAN STATISTIK JENERAL MARKETPLACE LA (GET /api/admin/global-stats)
======================================================= */
router.get('/global-stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSellers = await User.countDocuments({ role: 'seller' });
        const totalActiveSellers = await User.countDocuments({ role: 'seller', isVerified: true });
        
        const orders = await Order.find();
        const totalOrders = orders.length;
        
        // Kalkile gwo kòb total k ap vire sou sit la
        const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

        res.status(200).json({
            totalUsers,
            totalSellers,
            totalActiveSellers,
            totalOrders,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
