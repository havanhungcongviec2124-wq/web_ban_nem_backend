const Category = require("../models/Category.model");
const mongoose = require("mongoose");

// Tìm danh mục theo _id HOẶC slug (frontend có thể gửi cả hai dạng)
const findCategoryQuery = (idOrSlug) => {
  const trimmed = String(idOrSlug || "").trim();
  if (!trimmed) return null;
  return mongoose.isValidObjectId(trimmed)
    ? { _id: trimmed }
    : { slug: trimmed };
};

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

// GET /api/categories/:id — tìm theo _id hoặc slug
exports.getCategoryById = async (req, res) => {
  try {
    const query = findCategoryQuery(req.params.id);
    if (!query) return res.status(400).json({ success: false, message: "Thiếu mã danh mục" });
    const category = await Category.findOne(query);
    if (!category) return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    return res.json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { _id, id, createdAt, updatedAt, __v, ...data } = req.body;

    // Không cho hai danh mục trùng thứ tự hiển thị
    if (data.order !== undefined) {
      const order = Number(data.order);
      if (Number.isNaN(order)) {
        return res.status(400).json({ success: false, message: "Thứ tự hiển thị phải là số!" });
      }
      const duplicate = await Category.findOne({ order });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Thứ tự ${order} đã được dùng bởi danh mục "${duplicate.name}". Vui lòng chọn số khác!`,
        });
      }
      data.order = order;
    }

    const category = await Category.create(data);
    return res.status(201).json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/categories/:id — cập nhật theo _id hoặc slug
exports.updateCategory = async (req, res) => {
  try {
    const query = findCategoryQuery(req.params.id);
    if (!query) return res.status(400).json({ success: false, message: "Thiếu mã danh mục" });
    // Bỏ các trường khóa chính / tự động sinh để không ghi đè
    const { _id, id, slug, createdAt, updatedAt, __v, ...updateData } = req.body;

    // Không cho hai danh mục trùng thứ tự hiển thị (bỏ qua chính danh mục đang sửa)
    if (updateData.order !== undefined) {
      const order = Number(updateData.order);
      if (Number.isNaN(order)) {
        return res.status(400).json({ success: false, message: "Thứ tự hiển thị phải là số!" });
      }
      const current = await Category.findOne(query);
      if (!current) return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
      const clash = await Category.findOne({ order, _id: { $ne: current._id } });
      if (clash) {
        return res.status(409).json({
          success: false,
          message: `Thứ tự ${order} đã được dùng bởi danh mục "${clash.name}". Vui lòng chọn số khác!`,
        });
      }
      updateData.order = order;
    }

    const category = await Category.findOneAndUpdate(query, updateData, { returnDocument: 'after', runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    return res.json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/categories/:id — xóa theo _id hoặc slug
exports.deleteCategory = async (req, res) => {
  try {
    const query = findCategoryQuery(req.params.id);
    if (!query) return res.status(400).json({ success: false, message: "Thiếu mã danh mục" });
    const category = await Category.findOneAndDelete(query);
    if (!category) return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    return res.json({ success: true, message: "Đã xóa danh mục" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

