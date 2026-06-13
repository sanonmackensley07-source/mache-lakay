const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Konekte boutik la ak kont vandè a
    shopName: { type: String, required: true, unique: true },
    shopAddress: { type: String, required: true },
    shopPhone: { type: String, required: true },
    mainCategory: { type: String, required: true },
    desc: { type: String, default: "Byenveni nan boutik ofisyèl nou sou Mache Lakay!" },
    logo: { type: String, default: "assets/default-shop.jpg" },
    isPopular: { type: Boolean, default: false } // Pou nou ka afiche l nan "Boutik Popilè" sou paj akèy la
}, { timestamps: true });

module.exports = mongoose.model('Shop', ShopSchema);
