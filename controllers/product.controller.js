const Product = require("../models/Product.model");
const { serverError } = require("../utils/http");

// GET /api/products/meta — thông tin tổng quan
exports.getProductMeta = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const bestSellers = await Product.countDocuments({ isBestSeller: true });
    const featured = await Product.countDocuments({ isFeatured: true });
    return res.json({ success: true, meta: { total, bestSellers, featured } });
  } catch (error) {
    return serverError(res, error);
  }
};

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    let filter = {};
    if (category && category !== "all") filter.category = category;
    if (featured === "true") filter.isFeatured = true;
    if (search) filter.name = { $regex: search, $options: "i" };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (error) {
    return serverError(res, error);
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    // Hỗ trợ tìm theo _id hoặc slug
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { slug: req.params.id };
    const product = await Product.findOne(query);
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    return res.json({ success: true, product });
  } catch (error) {
    return serverError(res, error);
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({ success: true, product });
  } catch (error) {
    return serverError(res, error);
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { slug: req.params.id };
    const product = await Product.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    return res.json({ success: true, product });
  } catch (error) {
    return serverError(res, error);
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { slug: req.params.id };
    const product = await Product.findOneAndDelete(query);
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    return res.json({ success: true, message: "Đã xóa sản phẩm" });
  } catch (error) {
    return serverError(res, error);
  }
};

