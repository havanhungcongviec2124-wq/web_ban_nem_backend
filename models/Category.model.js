const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: "" },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  count: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);

