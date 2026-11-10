const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Vui lòng nhập họ tên"], trim: true },
  email: { type: String, required: [true, "Vui lòng nhập email"], unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, default: "" },
  password: { type: String, required: [true, "Vui lòng nhập mật khẩu"], minlength: [4, "Mật khẩu phải có ít nhất 4 ký tự"] },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  avatar: { type: String, default: "" },
  address: { type: String, default: "" },
}, { timestamps: true });

// Hash password trước khi lưu
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// So sánh password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
