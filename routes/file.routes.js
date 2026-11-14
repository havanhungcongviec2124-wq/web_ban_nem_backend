const express = require("express");
const mongoose = require("mongoose");
const Upload = require("../models/Upload.model");
const { serverError } = require("../utils/http");

const router = express.Router();

// GET /uploads/:id — trả ảnh đã lưu trong MongoDB
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: "Không tìm thấy ảnh" });
    }

    const doc = await Upload.findById(req.params.id).select("data contentType size");
    if (!doc || !doc.data) {
      return res.status(404).json({ success: false, message: "Không tìm thấy ảnh" });
    }

    res.set("Content-Type", doc.contentType || "image/png");
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.set("Content-Length", String(doc.data.length));
    return res.send(doc.data);
  } catch (error) {
    return serverError(res, error);
  }
});

module.exports = router;
