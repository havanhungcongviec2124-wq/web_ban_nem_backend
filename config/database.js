const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("⏳ Đang kết nối MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB kết nối thành công!");
    console.log(`📦 Database: ${mongoose.connection.name}`);

    return true;
  } catch (error) {
    console.error("❌ Kết nối MongoDB thất bại!");
    console.error("Chi tiết lỗi:", error.message);

    return false;
  }
};

module.exports = connectDB;