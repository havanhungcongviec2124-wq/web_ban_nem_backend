const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const uploadController = require("../controllers/upload.controller");
const { authenticate, authorizeAdmin } = require("../middlewares/auth.middleware");

// Lưu ảnh trong RAM rồi ghi vào MongoDB — chạy được cả trên Node lẫn Cloudflare Workers
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // tối đa 5MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(png|jpe?g|gif|webp|avif)$/i.test(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Chỉ hỗ trợ tập tin hình ảnh (PNG, JPG, GIF, WEBP, AVIF)"));
  },
});

// POST /api/uploads — chỉ admin được tải ảnh
router.post("/", authenticate, authorizeAdmin, upload.single("image"), uploadController.uploadImage);

// Chuyển lỗi của multer (quá dung lượng, sai định dạng) thành JSON thay vì trang HTML lỗi
router.use((err, req, res, next) => {
  // Không trả chi tiết kỹ thuật của multer ra ngoài
  const message =
    err && err.code === "LIMIT_FILE_SIZE"
      ? "Ảnh quá lớn, tối đa 5MB!"
      : "Tải ảnh thất bại. Vui lòng chọn ảnh PNG, JPG, GIF, WEBP hoặc AVIF.";
  return res.status(400).json({ success: false, message });
});

module.exports = router;
