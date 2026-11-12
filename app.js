const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/database");

const app = express();

app.set("trust proxy", true);
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ── Kết nối MongoDB (lazy + cache) ──────────────────────────────────────────
// Chạy được cả Node thường lẫn Cloudflare Workers: mỗi isolate chỉ kết nối 1 lần
// rồi dùng lại cho các request sau.
let connectionPromise = null;

const ensureDB = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connectionPromise) {
    connectionPromise = connectDB().then((ok) => {
      if (!ok) throw new Error("Không kết nối được MongoDB");
    });
    connectionPromise.catch(() => {
      connectionPromise = null;
    });
  }
  return connectionPromise;
};

app.get("/api/health", async (req, res) => {
  let dbError = null;
  try {
    await ensureDB();
  } catch (error) {
    dbError = require("./config/database").lastError || error.message;
  }
  res.json({
    success: true,
    server: "running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    hasMongoUri: Boolean(require("./config/env").getEnv("MONGODB_URI")),
    hasJwt: Boolean(require("./config/env").getEnv("JWT_SECRET")),
    mongoUriPrefix: String(require("./config/env").getEnv("MONGODB_URI")).slice(0, 24),
    dbError,
  });
});

app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Không kết nối được database",
      error: error.message,
    });
  }
});

// Routes
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const comboRoutes = require("./routes/combo.routes");
const orderRoutes = require("./routes/order.routes");
const cartRoutes = require("./routes/cart.routes");
const uploadRoutes = require("./routes/upload.routes");
const fileRoutes = require("./routes/file.routes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/combos", comboRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/uploads", uploadRoutes);

// Ảnh đã tải lên được lưu trong MongoDB và trả về qua /uploads/<id>
app.use("/uploads", fileRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Nếp Nem Backend API is running!",
  });
});

module.exports = app;
