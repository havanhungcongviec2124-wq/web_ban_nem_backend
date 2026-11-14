const User = require("../models/Auth.models");
const { serverError } = require("../utils/http");
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
      user: { name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role, avatar: newUser.avatar },
      token,
    });
  } catch (error) {
    return serverError(res, error);
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập Email/Số điện thoại và Mật khẩu!" });
    }

    // Cho phép đăng nhập bằng email hoặc số điện thoại.
    const identifier = String(email).trim();
    const normalizedEmail = identifier.toLowerCase();
    const phoneDigits = identifier.replace(/[^\d]/g, "");
    const query = identifier.includes("@")
      ? { email: normalizedEmail }
      : {
          $or: [
            { email: normalizedEmail },
            ...(phoneDigits ? [{ phone: phoneDigits }, { phone: identifier }] : []),
          ],
        };

    const user = await User.findOne(query);
    // Trả 200 với success:false để trình duyệt không ghi log lỗi 401 ra console.
    const invalid = () =>
      res.json({ success: false, message: "Số điện thoại/email hoặc mật khẩu không đúng." });
    if (!user) return invalid();
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return invalid();
    const token = generateToken(user._id);
    return res.json({
      success: true,
      message: "Đăng nhập thành công!",
      user: { name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar },
      token,
    });
  } catch (error) {
    return serverError(res, error);
  }
};

// GET /api/auth/me — chỉ trả thông tin cần thiết, không trả _id/__v của DB
exports.getMe = async (req, res) => {
  const u = req.user || {};
  return res.json({
    success: true,
    user: {
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      role: u.role || "user",
      avatar: u.avatar || "",
      address: u.address || "",
    },
  });
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
    return serverError(res, error);
  }
};

// GET /api/auth/users — admin lấy danh sách user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-_id -password -__v")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, users });
  } catch (error) {
    return serverError(res, error);
  }
};

