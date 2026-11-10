const mongoose = require("mongoose");

const cartItemSpicesSchema = new mongoose.Schema({
  garlic: { type: String, default: "Ít" },
  chili: { type: String, default: "Ít" },
  polyscias: { type: String, default: "Ít" },
}, { _id: false });

const cartComboSubItemSchema = new mongoose.Schema({
  productSlug: { type: String },
  name: { type: String },
  qtyText: { type: String },
  spices: cartItemSpicesSchema,
}, { _id: false });

const cartItemSchema = new mongoose.Schema({
  cartItemId: { type: String, required: true }, // unique key cho item trong giỏ
  productSlug: { type: String, required: true },
  name: { type: String, required: true },
  pack: { type: String, default: "" },
  price: { type: Number, required: true },
  unit: { type: String, default: "gói" },
  image: { type: String, default: "" },
  quantity: { type: Number, default: 1 },
  isCombo: { type: Boolean, default: false },
  spices: cartItemSpicesSchema,
  tag: { type: String, default: "" },
  comboSubItems: [cartComboSubItemSchema],
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);

