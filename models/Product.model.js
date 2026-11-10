const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  category: { type: String, required: true }, // slug của category
  categoryName: { type: String, default: "" },
  price: { type: Number, required: true },
  unit: { type: String, default: "gói" },
  sku: { type: String, default: "" },
  stock: { type: Number, default: 0 },
  pack: { type: String, default: "" },
  badge: { type: String, default: "" },
  shortDesc: { type: String, default: "" },
  storage: { type: String, default: "" },
  description: { type: String, default: "" },
  longDesc: { type: String, default: "" },
  ingredients: { type: String, default: "" },
  image: { type: String, default: "" },
  gallery: [{ type: String }],
  rating: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  isBestSeller: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  defaultSpices: {
    garlic: { type: String, enum: ["Ít", "Nhiều"], default: "Ít" },
    chili: { type: String, enum: ["Ít", "Nhiều"], default: "Ít" },
    polyscias: { type: String, enum: ["Ít", "Nhiều"], default: "Ít" },
  },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);

