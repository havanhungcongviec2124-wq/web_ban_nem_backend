const path = require("path");
const crypto = require("crypto");
const Upload = require("../models/Upload.model");

// POST /api/uploads — nhận 1 tập tin hình ảnh (field "image"), trả về URL công khai của ảnh
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy tập tin hình ảnh" });
    }

    const ext = (path.extname(req.file.originalname || "") || ".png").toLowerCase();
    const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;

    const doc = await Upload.create({
      filename,
      contentType: req.file.mimetype || "image/png",
      size: req.file.size || (req.file.buffer ? req.file.buffer.length : 0),
      data: req.file.buffer,
    });

    // Sau Cloudflare, Express nhận được host/proto thật qua các header này
    const proto = req.get("x-forwarded-proto") || req.protocol || "http";
    const host = req.get("x-forwarded-host") || req.get("host");
    const url = `${proto}://${host}/uploads/${doc._id}`;

    return res.json({ success: true, url, filename });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Tải ảnh thất bại" });
  }
};
