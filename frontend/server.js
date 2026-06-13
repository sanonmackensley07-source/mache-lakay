
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Connect MongoDB =====
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB konekte 

✔"))
.catch(err => console.error("Erè DB:", err));

// ===== Schemas & Models =====

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" }
});

const User = mongoose.model("User", userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,

    category: String,
    price: Number,
    description: String,
    image: String,
    createdBy: String
});

const Product = mongoose.model("Product", productSchema);

// ===== Routes =====

// Test route
app.get("/", (req, res) => {
    res.send("API Mache Lakay ap kouri ✔");
});

// ===== Auth Routes =====

// Register

app.post("/api/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.json({ message: "Kont kreye ✔" });
    } catch (err) {
        res.status(400).json({ error: "Erè pandan kreye kont" });
    }
});

// Login
app.post("/api/login", async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Imèl pa jwenn" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Modpas pa kòrèk" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login reyisi ✔", token });
});

// ===== Products Routes =====

// Get all products
app.get("/api/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Get products by category
app.get("/api/products/:category", async (req, res) => {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.json(products);
});

// Add product (example: need token in real app)
app.post("/api/products", async (req, res) 

=> {
    const { name, category, price, description, image, createdBy } = req.body;
    const product = new Product({ name, category, price, description, image, createdBy });
    await product.save();
    res.json({ message: "Pwodwi ajoute ✔" });
});

// ===== Start server =====
app.listen(PORT, () => {
    console.log(`Server ap kouri sou port ${PORT} ✔`);
});
