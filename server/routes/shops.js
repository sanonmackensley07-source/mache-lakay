const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop'); // Rele modèl la ak S majiskil

/* =======================================================
   🟢 1. PRAN TOUT BOUTIK (Oswa sèlman sa ki popilè yo pou Index)
======================================================= */
router.get('/', async (req, res) => {
    try {
        const isPopularOnly = req.query.popular;
        let query = {};
        
        // Si frontend lan mande sèlman boutik popilè yo (?popular=true)
        if (isPopularOnly === "true") {
            query.isPopular = true;
        }

        const shops = await Shop.find(query).sort({ createdAt: -1 });
        
        // Si baz done a vid pou kounye a, nou ba li fo done sa yo pou tès vizyèl sou paj la pa blayi
        if (shops.length === 0) {
            return res.json([
                { shopName: "💻 Tech Lakay", mainCategory: "Elektwonik & Teknoloji" },
                { shopName: "👕 Fashion Haiti", mainCategory: "Rad & Akseswa" },
                { shopName: "📱 Mobile Store", mainCategory: "Telefòn & Gadjèt" },
                { shopName: "🍔 Bon Gou Market", mainCategory: "Manje & Bwason" },
                { shopName: "🏠 Lakay Deco", mainCategory: "Kay & Mèb" },
                { shopName: "🚗 Auto Parts Haiti", mainCategory: "Machin & Pyès" }
            ]);
        }

        res.json(shops);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* =======================================================
   🔵 2. KREYE OTO EN BOUTIK LÈ VANDÈ A FIN ENSRIPRI
======================================================= */
router.post('/create', async (req, res) => {
    try {
        const { userId, shopName, shopAddress, shopPhone, mainCategory } = req.body;

        const newShop = new Shop({
            userId,
            shopName,
            shopAddress,
            shopPhone,
            mainCategory,
            isPopular: true // Nou tou mete l popilè pou tès la ka parèt sou akèy la touswit
        });

        const savedShop = await newShop.save();
        res.status(201).json(savedShop);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
