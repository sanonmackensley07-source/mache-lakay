// app.js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const multer = require("multer");
const path = require("path");

// =================== CONFIG ===================
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =================== SQL CONFIG ===================
const dbConfig = {
  user: "YOUR_DB_USER",
  password: "YOUR_DB_PASSWORD",
  server: "localhost",
  database: "Mache_lakay",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    await sql.connect(dbConfig);
    console.log("✅ SQL Server Connected!");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  }
}

// =================== MULTER UPLOAD ===================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// =================== ROUTES ===================

// --------- Register User / Seller ----------
app.post("/register", async (req, res) => {
  const { name, email, password, role, shop_name } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields required!" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await new sql.Request()
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword)
      .input("role", sql.NVarChar, role || "buyer")
      .input("shop_name", sql.NVarChar, shop_name || null)
      .query(`
        INSERT INTO users (name, email, password, role, shop_name)
        VALUES (@name,@email,@password,@role,@shop_name)
    `);
    res.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------- Login ----------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email & password required!" });

  try {
    const request = new sql.Request();
    const result = await request.input("email", sql.NVarChar, email)
      .query("SELECT * FROM users WHERE email=@email");
    const user = result.recordset[0];
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, role: user.role }, "SECRET_KEY", { expiresIn: "1d" });
    res.json({ message: "Login success!", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------- Add Product ----------
app.post("/product", upload.array("images", 5), async (req, res) => {
  const { seller_id, name, description, price, currency, stock } = req.body;
  if (!seller_id || !name || !price) return res.status(400).json({ message: "Required fields missing!" });

  try {
    const request = new sql.Request()
      .input("seller_id", sql.Int, seller_id)
      .input("name", sql.NVarChar, name)
      .input("description", sql.NVarChar, description || "")
      .input("price", sql.Decimal(10,2), price)
      .input("currency", sql.NVarChar, currency || "HTG")
      .input("stock", sql.Int, stock || 0);

    const result = await request.query(`
      INSERT INTO products (seller_id,name,description,price,currency,stock)
      OUTPUT INSERTED.id
      VALUES (@seller_id,@name,@description,@price,@currency,@stock)
    `);

    const productId = result.recordset[0].id;

    // Save images
    for (let file of req.files) {
      await new sql.Request()
        .input("product_id", sql.Int, productId)
        .input("image_url", sql.NVarChar, "/uploads/" + file.filename)
        .query("INSERT INTO product_images (product_id, image_url) VALUES (@product_id,@image_url)");
    }

    res.json({ message: "Product added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------- Get All Products ----------
app.get("/products", async (req, res) => {
  try {
    const result = await new sql.Request().query(`
      SELECT p.*, pi.image_url
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// =================== START SERVER ===================
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});