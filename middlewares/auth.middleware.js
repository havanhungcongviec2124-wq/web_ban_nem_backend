const jwt = require("jsonwebtoken");
const User = require("../models/Auth.models");
const { getEnv } = require("../config/env");

const JWT_SECRET = getEnv(
  "JWT_SECRET",
  "b91e0b990635362e07b9789899538b321fd84123ccf5ee2a07edae6706c03fd6"
);

// Middleware xác thực token
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: "Vui lòng đăng nhập!" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Tài khoản không tồn tại!" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token không hợp lệ!" });
  }
};

// Middleware kiểm tra admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Chỉ Admin mới có quyền truy cập!" });
  }
};

// Tạo JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};

module.exports = { protect, adminOnly, authenticate: protect, authorizeAdmin: adminOnly, generateToken };

