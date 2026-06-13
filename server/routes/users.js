const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // 👤 Enfòmasyon de baz pou tout moun
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['customer', 'seller'], 
        default: 'customer' 
    },
    
    // 🏪 Detay sa yo ap ranpli SÈLMAN si moun nan se yon Vandè (seller)
    sellerProfile: {
        shopName: { type: String },
        shopAddress: { type: String },
        shopPhone: { type: String },
        nif: { type: String },
        cin: { type: String },
        mainCategory: { type: String },
        payoutMethod: { type: String },
        payoutDetails: { type: String },
        documentUrl: { type: String, default: "assets/default-doc.pdf" }
    },

    // 📱 Lojik kontwòl peman 2,500 HTG ak aktivasyon kont lan
    paymentStatus: { 
        type: String, 
        enum: ['unpaid', 'pending', 'paid'], 
        default: 'unpaid' 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    }, // Admin ap pase l true lè l fin tcheke pyès yo
    moncashOrderId: { type: String }
}, { timestamps: true }); // Sa ap ajoute dat kreyasyon kont lan otomatikman

module.exports = mongoose.model('User', UserSchema);
