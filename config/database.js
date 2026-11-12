const mongoose = require("mongoose");
const { getEnv } = require("./env");

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) return true;

    const uri = getEnv("MONGODB_URI");
    if (!uri) throw new Error("Thiếu biến môi trường MONGODB_URI");

    console.log("⏳ Đang kết nối MongoDB...");

    await mongoose.connect(uri);

    console.log("✅ MongoDB kết nối thành công!");
    console.log(`📦 Database: ${mongoose.connection.name}`);

    return true;
  } catch (error) {
    console.error("❌ Kết nối MongoDB thất bại!");
    console.error("Chi tiết lỗi:", error.message);
    connectDB.lastError = error.message;

    return false;
  }
};

module.exports = connectDB;
