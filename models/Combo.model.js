const mongoose = require("mongoose");

const comboItemSchema = new mongoose.Schema({
  productSlug: { type: String, required: true }, // slug of product
  name: { type: String, required: true },
  qty: { type: Number, default: 1 },
  qtyLabel: { type: String, default: "" },
  image: { type: String, default: "" },
  defaultSpices: {
    garlic: { type: String, enum: ["Ít", "Nhiều"], default: "Ít" },
    chili: { type: String, enum: ["Ít", "Nhiều"], default: "Ít" },
    polyscias: { type: String, enum: ["Ít", "Nhiều"], default: "Ít" },
  },
}, { _id: false });

const comboSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  category: { type: String, default: "combo" },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  image: { type: String, default: "" },
  gallery: [{ type: String }],
  sku: { type: String, default: "" },
  badge: { type: String, default: "" },
  soldCount: { type: Number, default: 0 },
  status: { type: String, enum: ["Đang bán", "Ngừng bán", "Hết hàng"], default: "Đang bán" },
  pack: { type: String, default: "" },
  shortDesc: { type: String, default: "" },
  description: { type: String, default: "" },
  itemsIncluded: [{ type: String }],
  comboItems: [comboItemSchema],
  defaultSpices: {
    garlic: { type: String, enum: ["Ít", "Nhiều"], default: "Ít" },
    chili: { type: String, enum: ["Ít", "Nhiều"], default: "Ít" },
    polyscias: { type: String, enum: ["Ít", "Nhiều"], default: "Ít" },
  },
}, { timestamps: true });

module.exports = mongoose.model("Combo", comboSchema);

