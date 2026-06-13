const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

/* =======================================================
   🔍 RECHÈCH ENTÈLIJAN AK SEKIRITE (GET /api/search)
======================================================= */
router.get("/", async (req, res) => {
  try {
    const q = req.query.q;

    // 🚀 SEKIRITE: Si itilizatè a pa tape anyen oswa si "q" vid, nou tou ba li tout pwodwi yo nòmalman
    if (!q || q.trim() === "") {
        const allProducts = await Product.find().sort({ createdAt: -1 });
        return res.json(allProducts);
    }

    // Rechèch avanse: L ap chèche mo a nan Non, Kategori, oswa non Vandè a an menm tan
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { vande: { $regex: q, $options: "i" } }
      ]
    }).sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {
    console.error("❌ Erè nan motè rechèch la:", error.message);
    res.status(500).json({ message: "Erè sèvè nan rechèch la: " + error.message });
  }
});

module.exports = router;
