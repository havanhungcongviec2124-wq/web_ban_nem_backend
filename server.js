require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const comboRoutes = require("./routes/combo.routes");
const orderRoutes = require("./routes/order.routes");
const cartRoutes = require("./routes/cart.routes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/combos", comboRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Nếp Nem Backend API is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    server: "running",
    database:
      require("mongoose").connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

const startServer = async () => {
  try {
    console.log("🚀 Đang khởi động Backend...");

    const isConnected = await connectDB();

    if (!isConnected) {
      console.error("⛔ Backend không thể khởi động vì MongoDB lỗi!");
      process.exit(1);
    }

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log("-----------------------------------");
      console.log("✅ BACKEND KHỞI ĐỘNG THÀNH CÔNG");
      console.log(`🌐 Local: http://localhost:${PORT}`);
      console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
      console.log("-----------------------------------");
    });
  } catch (error) {
    console.error("❌ Backend khởi động thất bại:", error.message);
    process.exit(1);
  }
};

startServer();
