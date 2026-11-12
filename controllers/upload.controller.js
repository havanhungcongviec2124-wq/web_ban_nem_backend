// POST /api/uploads — nhận 1 tập tin hình ảnh (field "image"), trả về URL công khai của ảnh
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Không tìm thấy tập tin hình ảnh" });
  }
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  return res.json({ success: true, url, filename: req.file.filename });
};
