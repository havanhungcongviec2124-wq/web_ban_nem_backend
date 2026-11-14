## Kế hoạch Backend + Kết nối Frontend cho Nếp Nem
Tổng quan

Chuyển toàn bộ dữ liệu từ fake data (mockData.js, authData.js) sang MongoDB + Express API thực.

IMPORTANT

Backend dùng Node.js + Express + MongoDB (Mongoose), không dùng JWT phức tạp — giữ đơn giản với token mock, sau này nâng cấp.

Stack hiện có
Backend: Express 5, Mongoose 9, MongoDB Atlas
Frontend: React + Vite, HashRouter, TailwindCSS
DB URI: Đã có sẵn trong .env
## 1. Backend Models (Mongoose)
Model	Collection	Mô tả
User	users	Đăng ký, đăng nhập, phân quyền (đã có)
Category	categories	Danh mục sản phẩm
Product	products	Sản phẩm nem (có gia vị mặc định, gallery, stock)
Combo	combos	Combo sản phẩm (gồm nhiều comboItems)
Order	orders	Đơn hàng (items, spices, trạng thái, timeline)
Cart	carts	Giỏ hàng theo user (items + spices)
## 2. Backend API Routes
Auth (/api/auth) — ĐÃ CÓ, cần bổ sung
POST /register ✅
POST /login ✅
GET /me ✅
GET /users (admin) — lấy danh sách khách hàng
Products (/api/products)
GET / — lấy tất cả sản phẩm
GET /:id — chi tiết sản phẩm
POST / (admin) — tạo sản phẩm
PUT /:id (admin) — cập nhật
DELETE /:id (admin) — xóa
Categories (/api/categories)
GET / — lấy tất cả danh mục
POST / (admin) — tạo
PUT /:id (admin) — cập nhật
DELETE /:id (admin) — xóa
Combos (/api/combos)
GET / — lấy tất cả combo
GET /:id — chi tiết combo
POST / (admin) — tạo combo
PUT /:id (admin) — cập nhật
DELETE /:id (admin) — xóa
Orders (/api/orders)
GET / (admin) — tất cả đơn
GET /my-orders — đơn của user đang login
GET /:id — chi tiết đơn
POST / — tạo đơn mới (checkout)
PUT /:id/status (admin) — cập nhật trạng thái
Cart (/api/cart)
GET / — giỏ hàng của user
POST /add — thêm item
PUT /update — cập nhật số lượng
DELETE /remove/:cartItemId — xóa item
DELETE /clear — xóa toàn bộ
## 3. Dữ liệu

Toàn bộ dữ liệu (sản phẩm, combo, danh mục, người dùng, đơn hàng, giỏ hàng) được lưu trực tiếp trong MongoDB Atlas và quản lý qua API/trang Admin. Backend không còn script seed và không tự sinh dữ liệu mẫu.
4. Frontend — Cập nhật kết nối
AuthContext.jsx → gọi /api/auth/login, /api/auth/register
CartContext.jsx → gọi /api/cart/*
Các trang admin → gọi API tương ứng
Các trang public (Products, Combos, Home) → gọi /api/products, /api/combos
Checkout → POST /api/orders
5. Thứ tự triển khai
✅ Tạo tất cả Models
✅ Tạo tất cả Routes + Controllers
✅ Dữ liệu nạp trực tiếp vào MongoDB Atlas (không còn seed.js)
✅ Cập nhật server.js đăng ký routes mới
✅ Cập nhật frontend AuthContext, CartContext
✅ Cập nhật frontend pages gọi API thực