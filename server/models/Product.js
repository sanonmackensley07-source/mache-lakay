const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "assets/laptop.jpg" },
    desc: { type: String },
    vande: { type: String, default: "Vandè Mache Lakay" } // 👈 Sa te manke pou idantifye boutik la
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
