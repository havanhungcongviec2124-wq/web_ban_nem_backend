const Combo = require("../models/Combo.model");
const { serverError } = require("../utils/http");

// GET /api/combos
exports.getCombos = async (req, res) => {
  try {
    const combos = await Combo.find().sort({ createdAt: -1 });
    return res.json({ success: true, combos });
  } catch (error) {
    return serverError(res, error);
  }
};

// GET /api/combos/:id
exports.getComboById = async (req, res) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { slug: req.params.id };
    const combo = await Combo.findOne(query);
    if (!combo) return res.status(404).json({ success: false, message: "Không tìm thấy combo" });
    return res.json({ success: true, combo });
  } catch (error) {
    return serverError(res, error);
  }
};

// POST /api/combos
exports.createCombo = async (req, res) => {
  try {
    const combo = await Combo.create(req.body);
    return res.status(201).json({ success: true, combo });
  } catch (error) {
    return serverError(res, error);
  }
};

// PUT /api/combos/:id
exports.updateCombo = async (req, res) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { slug: req.params.id };
    const combo = await Combo.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
    if (!combo) return res.status(404).json({ success: false, message: "Không tìm thấy combo" });
    return res.json({ success: true, combo });
  } catch (error) {
    return serverError(res, error);
  }
};

// DELETE /api/combos/:id
exports.deleteCombo = async (req, res) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { slug: req.params.id };
    await Combo.findOneAndDelete(query);
    return res.json({ success: true, message: "Đã xóa combo" });
  } catch (error) {
    return serverError(res, error);
  }
};

