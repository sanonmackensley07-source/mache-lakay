const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart'); // Rele modèl Mongoose la

/* =======================================================
   🟢 1. PRAN PANYEN AN (GET /api/cart/:userId)
======================================================= */
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.json(cart ? cart.items : []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* =======================================================
   🔵 2. AJOUTE NAN PANYEN AN (POST /api/cart/add)
======================================================= */
router.post('/add', async (req, res) => {
    const { userId, product } = req.body;

    if (!userId || !product) {
        return res.status(400).json({ message: "UserId ak Pwodwi obligatwa!" });
    }

    try {
        // Chèche si kliyan sa a gen yon panyen ki te kreye deja
        let cart = await Cart.findOne({ userId });
        const productId = product._id || product.id;

        const itemData = {
            productId: productId.toString(),
            name: product.name,
            price: parseFloat(product.price),
            quantity: product.quantity || 1
        };

        if (cart) {
            // Si panyen an egziste, nou tcheke si pwodwi a deja ladan l
            const itemIndex = cart.items.findIndex(item => item.productId === itemData.productId);

            if (itemIndex > -1) {
                // Si l deja la, nou jis ogmante kantite a
                cart.items[itemIndex].quantity += itemData.quantity;
            } else {
                // Si l pa ko la, nou ajoute l nan lis la
                cart.items.push(itemData);
            }
            cart = await cart.save();
        } else {
            // Si kliyan an potko gen panyen menm, nou kreye yon nouvo nèt
            const newCart = new Cart({
                userId,
                items: [itemData]
            });
            cart = await newCart.save();
        }

        res.status(200).json(cart.items);

    } catch (err) {
        console.error("❌ Erè nan panyen MongoDB:", err.message);
        res.status(500).json({ message: err.message });
    }
});

/* =======================================================
   🔴 3. RETIRE YON ATIK NAN PANYEN AN (POST /api/cart/remove)
======================================================= */
router.post('/remove', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Panyen pa jwenn" });

        // Filtre lis la pou retire pwodwi sa a
        cart.items = cart.items.filter(item => item.productId !== productId.toString());
        cart = await cart.save();

        res.status(200).json(cart.items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
