const Order = require("../models/Order.model");
const Cart = require("../models/Cart.model");

// GET /api/orders — admin lấy tất cả đơn
exports.getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && status !== "all") filter.status = status;
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/my-orders — user lấy đơn của mình
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    if (req.user.role !== "admin" && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Không có quyền xem đơn hàng này" });
    }
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/orders — tạo đơn hàng (checkout)
exports.createOrder = async (req, res) => {
  try {
    const { customerName, phone, email, address, city, district, desiredEatTime, note, paymentMethod, items, subtotal, shippingFee, totalAmount, voucherCode, voucherDiscount } = req.body;

    if (!customerName || !phone || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin và có ít nhất 1 sản phẩm!" });
    }

    // Tạo orderCode
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const count = await Order.countDocuments() + 1;
    const orderCode = `NN${day}${month}-${String(count).padStart(3, "0")}`;
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} · ${day}/${month}`;

    const order = await Order.create({
      orderCode,
      userId: req.user._id,
      customerName,
      phone,
      email: email || "",
      address: address || "",
      city: city || "",
      district: district || "",
      desiredEatTime: desiredEatTime || "",
      note: note || "",
      paymentMethod: paymentMethod || "COD",
      items,
      subtotal: subtotal || 0,
      shippingFee: shippingFee || 30000,
      totalAmount: totalAmount || 0,
      voucherCode: voucherCode || "",
      voucherDiscount: voucherDiscount || 0,
      timeline: [
        { time: timeStr, title: "Khách đặt đơn trên cửa hàng", done: true },
        { time: timeStr, title: "Đã lưu gia vị, ghi chú và thời điểm sử dụng", done: true },
        { time: "", title: "Liên hệ khách, xác nhận lịch giao phù hợp", done: false, current: true },
      ],
    });

    // Xóa giỏ hàng sau khi đặt
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    return res.status(201).json({ success: true, message: "Đặt hàng thành công!", order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/orders/:id/status — admin cập nhật trạng thái
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, assignee, scheduleNote, paymentStatus } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (assignee !== undefined) updateData.assignee = assignee;
    if (scheduleNote !== undefined) updateData.scheduleNote = scheduleNote;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

