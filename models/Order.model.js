const mongoose = require("mongoose");

const orderItemSpicesSchema = new mongoose.Schema({
  garlic: { type: String, default: "Ít" },
  chili: { type: String, default: "Ít" },
  polyscias: { type: String, default: "Ít" },
}, { _id: false });

const comboSubItemSchema = new mongoose.Schema({
  name: { type: String },
  qtyText: { type: String },
  spices: orderItemSpicesSchema,
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  productSlug: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, default: "" },
  pack: { type: String, default: "" },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: "gói" },
  isCombo: { type: Boolean, default: false },
  spices: orderItemSpicesSchema,
  tag: { type: String, default: "" },
  comboSubItems: [comboSubItemSchema],
}, { _id: false });

const timelineEntrySchema = new mongoose.Schema({
  time: { type: String, default: "" },
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  current: { type: Boolean, default: false },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderCode: { type: String, required: true, unique: true }, // NN0611-028
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  customerName: { type: String, required: true },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  district: { type: String, default: "" },
  desiredEatTime: { type: String, default: "" },
  note: { type: String, default: "" },
  paymentMethod: { type: String, enum: ["COD", "bank_transfer"], default: "COD" },
  paymentStatus: { type: String, enum: ["Chưa thanh toán", "Đã thu"], default: "Chưa thanh toán" },
  status: { type: String, enum: ["Chờ xác nhận", "Đang chuẩn bị", "Đang giao", "Hoàn tất", "Đã hủy"], default: "Chờ xác nhận" },
  source: { type: String, default: "Cửa hàng trực tuyến" },
  subtotal: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 30000 },
  totalAmount: { type: Number, default: 0 },
  items: [orderItemSchema],
  timeline: [timelineEntrySchema],
  assignee: { type: String, default: "" },
  scheduleNote: { type: String, default: "" },
  voucherCode: { type: String, default: "" },
  voucherDiscount: { type: Number, default: 0 },
}, { timestamps: true });

// Tự động tạo orderCode
orderSchema.pre("save", async function () {
  if (!this.orderCode) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const count = await mongoose.model("Order").countDocuments() + 1;
    this.orderCode = `NN${day}${month}-${String(count).padStart(3, "0")}`;
  }
});

module.exports = mongoose.model("Order", orderSchema);

