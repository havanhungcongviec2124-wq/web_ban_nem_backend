const jwt = require("jsonwebtoken");
const User = require("../models/Auth.models");
const { getEnv } = require("../config/env");

const JWT_SECRET = getEnv(
  "JWT_SECRET",
  "b91e0b990635362e07b9789899538b321fd84123ccf5ee2a07edae6706c03fd6"
);

// Trả về HTTP 200 kèm success:false cho các trường hợp chưa đăng nhập / phiên hết hạn.
// Lý do: trình duyệt luôn ghi log lỗi ra console với mọi phản hồi 4xx, kể cả khi
// đó chỉ là trạng thái bình thường (khách chưa đăng nhập). Nội dung trả về vẫn
// trung tính, không lộ thông tin kỹ thuật.
const authFailed = (res) =>
  res.json({ success: false, authRequired: true, message: "Vui lòng đăng nhập để tiếp tục." });

// Middleware xác thực token
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return authFailed(res);
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return authFailed(res);
    }
    next();
  } catch (error) {
    return authFailed(res);
  }
};

// Middleware kiểm tra admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.json({ success: false, message: "Bạn không có quyền thực hiện thao tác này." });
  }
};

// Tạo JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};

module.exports = { protect, adminOnly, authenticate: protect, authorizeAdmin: adminOnly, generateToken };

