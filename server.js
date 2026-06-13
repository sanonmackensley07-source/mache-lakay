// 1. Tou dechaje dotenv an premye nèt
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./server/config/db");

// 2. Kreye aplikasyon Express la
const app = express();

// 3. Konekte ak baz done MongoDB Atlas
connectDB();

// 4. Middlewares pou jere sekirite ak done JSON
app.use(cors());
app.use(express.json());

/* =====================================
   🛒 TOUT WOUT API MACHE LAKAY YO
===================================== */
app.use("/api/auth", require("./server/routes/auth"));
app.use("/api/products", require("./server/routes/products"));
app.use("/api/orders", require("./server/routes/orders"));
app.use("/api/cart", require("./server/routes/cart"));
app.use("/api/seller", require("./server/routes/seller"));
app.use("/api/payment", require("./server/routes/payment"));
app.use("/api/admin", require("./server/routes/admin"));
app.use("/api/search", require("./server/routes/search"));
app.use("/api/shops", require("./server/routes/shops"));
const Cart = require('./server/models/Cart');




// Wout tès prensipal la
app.get("/", (req, res) => {
  res.send("🚀 Mache Lakay API ap mache byen pwòp!");
});

// 5. Konfigirasyon Pò Sèvè a
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log("Server ap kouri sou port", PORT);
});
