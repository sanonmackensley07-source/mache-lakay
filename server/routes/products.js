const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/* =======================================================
   🟢 1. PRAN TOUT PWODWI (Pou paj index.html ak shop.html)
======================================================= */
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }); // Montre dènye pwodwi yo an premye
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* =======================================================
   🔵 2. AJOUTE NOUVO PWODWI (Pou fòm nan paj seller.html)
======================================================= */
router.post('/add', async (req, res) => {
    try {
        const { name, price, category, desc, vande, image } = req.body;

        // Validasyon rapid pou asire tout enfòmasyon yo antre
        if (!name || !price || !category) {
            return res.status(400).json({ message: "Tanpri ranpli Non, Pri ak Kategori a!" });
        }

        const newProduct = new Product({
            name,
            price: parseFloat(price),
            category,
            desc,
            vande,
            image: image || "assets/laptop.jpg" // Si pa gen foto, li mete yon fo foto pa defo
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct); // Voye siksè bay frontend lan

    } catch (err) {
        console.error("❌ Erè Backend nan piblikasyon:", err.message);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
