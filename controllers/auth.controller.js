const User = require("../models/Auth.models");
const { generateToken } = require("../middlewares/auth.middleware");

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu!" });
    }
    if (password.length < 4) {
      return res.status(400).json({ success: false, message: "Mật khẩu phải có ít nhất 4 ký tự!" });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email này đã được đăng ký!" });
    }
    // Đăng ký công khai luôn tạo tài khoản Khách hàng.
    // Tài khoản Admin chỉ được tạo qua seed/điều hành hệ thống, không qua API công khai.
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : "",
      password,
      role: "user",
    });
    const token = generateToken(newUser._id);
    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công!",
      user: { id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role, avatar: newUser.avatar },
      token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Lỗi máy chủ" });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập Email và Mật khẩu!" });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không chính xác!" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không chính xác!" });
    }
    const token = generateToken(user._id);
    return res.json({
      success: true,
      message: "Đăng nhập thành công!",
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar },
      token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  return res.json({ success: true, user: req.user });
};

// GET /api/auth/check-email?email=... — kiểm tra email đã có tài khoản chưa
exports.checkEmail = async (req, res) => {
  try {
    const email = (req.query.email || '').toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ success: false, message: 'Thiếu tham số email!' });
    }
    const existingUser = await User.findOne({ email }).select('_id');
    return res.json({ success: true, exists: Boolean(existingUser) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/users — admin lấy danh sách user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

