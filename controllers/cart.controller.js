const Cart = require("../models/Cart.model");

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    return res.json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/cart/add
exports.addToCart = async (req, res) => {
  try {
    const { cartItemId, productSlug, name, pack, price, unit, image, quantity, isCombo, spices, tag, comboSubItems } = req.body;

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex((item) => item.cartItemId === cartItemId);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += (quantity || 1);
    } else {
      cart.items.push({
        cartItemId: cartItemId || `${productSlug}_${Date.now()}`,
        productSlug,
        name,
        pack: pack || "",
        price,
        unit: unit || "gói",
        image: image || "",
        quantity: quantity || 1,
        isCombo: isCombo || false,
        spices: spices || {},
        tag: tag || "",
        comboSubItems: comboSubItems || [],
      });
    }

    await cart.save();
    return res.json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/cart/update
exports.updateCartItem = async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Giỏ hàng trống" });

    const item = cart.items.find((i) => i.cartItemId === cartItemId);
    if (!item) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm trong giỏ" });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.cartItemId !== cartItemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    return res.json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/cart/remove/:cartItemId
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Giỏ hàng trống" });

    cart.items = cart.items.filter((i) => i.cartItemId !== req.params.cartItemId);
    await cart.save();
    return res.json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/cart/clear
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return res.json({ success: true, message: "Đã xóa giỏ hàng" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/cart/sync — đồng bộ toàn bộ giỏ hàng
exports.syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: items || [] });
    } else {
      cart.items = items || [];
      await cart.save();
    }
    return res.json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

