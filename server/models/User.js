const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // 👤 1. ENFÒMASYON DE BAZ (Pou tout moun)
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
    
    // 🔑 2. SISTÈM SEKIRITE KÒD 6 CHIF (OTP EMAIL VERIFICATION)
    isEmailVerified: { 
        type: Boolean, 
        default: false 
    }, // L ap vin true lè l fin antre kòd 6 chif la nan verify-email.html
    otpCode: { 
        type: String 
    }, // Kòd 6 chif o aza ki pati nan imel la
    otpExpires: { 
        type: Date 
    }, // Dat ak lè kòd la ap ekspire (valid pou 15 minit)

    // 🏪 3. ENFÒMASYON LEGAL AK OPERASYONÈL BOUTIK (Sèlman si wòl la se 'seller')
    sellerProfile: {
        shopName: { type: String },
        shopAddress: { type: String },
        shopPhone: { type: String },
        nif: { type: String }, // Numéro d'Identité Fiscale
        cin: { type: String }, // Carte d'Identité Nationale / Patante
        mainCategory: { type: String }, // Kategori prensipal boutik la
        payoutMethod: { type: String }, // moncash_business, natcash_business, oswa bank_haiti
        payoutDetails: { type: String }, // Nimewo kont oswa tlf kote n ap transfere kòb lavant li yo
        documentUrl: { type: String, default: "assets/default-doc.pdf" } // Lyen kote foto NIF/CIN an sove
    },

    // 📱 4. KONTWÒL PEMAN ENSRIPSYON 2 500 HTG SOU MONCASH / NATCASH
    paymentStatus: { 
        type: String, 
        enum: ['unpaid', 'pending', 'paid'], 
        default: 'unpaid' 
    }, // 'pending' lè l soumèt kòd tranzaksyon an, 'paid' lè l konfime
    isVerified: { 
        type: Boolean, 
        default: false 
    }, // Admin ap pase sa true lè l fin tcheke si pyès yo kòrèk nan admin dashboard la
    moncashOrderId: { 
        type: String 
    } // Nimewo referans inik kòmand lan pou swiv li sou Digicel/Natcom
}, { 
    timestamps: true // Sa ap ajoute otomatikman dat kont lan kreye (createdAt) ak dat li modifye (updatedAt)
});

module.exports = mongoose.model('User', UserSchema);
