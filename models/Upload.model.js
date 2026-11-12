const mongoose = require("mongoose");

// Ảnh do admin tải lên được lưu thẳng trong MongoDB (dạng Buffer).
// Cách này chạy được cả trên Node thường lẫn Cloudflare Workers
// (Workers không có ổ đĩa để ghi file như multer diskStorage).
const uploadSchema = new mongoose.Schema(
  {
    filename: { type: String, default: "" },
    contentType: { type: String, default: "application/octet-stream" },
    size: { type: Number, default: 0 },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);
