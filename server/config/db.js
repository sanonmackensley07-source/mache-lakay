const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Fonksyon sa a konekte ak MongoDB lè l sèvi ak lyen ki nan .env
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log("✅ Baz done MongoDB konekte avèk siksè!");
    } catch (err) {
        console.error("❌ Erè koneksyon MongoDB:", err.message);
        // Si gen erè, nou sispann sèvè a pou nou ka wè sa k pase
        process.exit(1); 
    }
};

module.exports = connectDB;