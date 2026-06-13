const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const URI = "mongodb+srv://mache_admin:Mackensley2004$@cluster0.yskmwt2.mongodb.net/MacheLakay?retryWrites=true&w=majority";
        await mongoose.connect(URI);
        console.log("✅ Baz done MongoDB konekte avèk siksè nan db.js!");
    } catch (err) {
        console.error("❌ Erè koneksyon db.js:", err.message);
    }
};

module.exports = connectDB;
