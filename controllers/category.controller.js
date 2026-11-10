const Category = require("../models/Category.model");

// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ visible: true }).sort({ order: 1 });
    return res.json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/categories/all — admin lấy tất cả (kể cả ẩn)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    return res.json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    return res.json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    return res.json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Đã xóa danh mục" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

