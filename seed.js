require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/database");

const User = require("./models/Auth.models");
const Category = require("./models/Category.model");
const Product = require("./models/Product.model");
const Combo = require("./models/Combo.model");
const Order = require("./models/Order.model");

const categoriesData = [
  {
    name: "Tất cả sản phẩm",
    slug: "all",
    order: 0,
    visible: true,
    description: "Tất cả các sản phẩm Nếp Nem",
  },
  {
    name: "Nem truyền thống",
    slug: "nem-truyen-thong",
    order: 1,
    visible: true,
    description: "Nem chua vị quen, gói nhỏ vừa ăn cho những bữa sum vầy.",
  },
  {
    name: "Nem hương lá",
    slug: "nem-huong-la",
    order: 2,
    visible: true,
    description: "Nem gói cùng lá thơm, vị thanh nhẹ, chua dịu vừa miệng.",
  },
  {
    name: "Nem cối & rán",
    slug: "nem-coi-ran",
    order: 3,
    visible: true,
    description: "Cối lớn cho bàn đông và nem rán giòn ngoài mềm trong.",
  },
  {
    name: "Combo & quà tặng",
    slug: "combo",
    order: 4,
    visible: true,
    description: "Kết hợp món, điều chỉnh số lượng và giữ riêng khẩu vị từng thành phần.",
  },
];

const productsData = [
  {
    name: "Nem chua truyền thống",
    slug: "nem-chua-truyen-thong",
    category: "nem-truyen-thong",
    categoryName: "Nem truyền thống",
    price: 85000,
    unit: "gói 10 chiếc",
    sku: "NN-TT-10",
    stock: 128,
    pack: "10 chiếc · 200 g / gói",
    badge: "Được yêu thích",
    shortDesc: "10 chiếc · 200 g",
    storage: "Giữ lạnh 0–4°C. Xem hạn dùng trên nhãn từng mẻ.",
    description: "Chua dịu, giòn nhẹ, thơm vị lá. Một gói nhỏ cho bữa vui thêm đậm đà, với gia vị được chọn riêng theo ý bạn.",
    longDesc: "Nem được gói thành từng phần vừa ăn, với vị chua dịu của thịt lên men, độ giòn nhẹ của bì và hương thơm của lá. Ăn kèm tương ớt, dưa chuột hoặc đinh lăng tùy thích.",
    ingredients: "Thịt heo, bì heo, thính gạo, gia vị, tỏi, ớt, đinh lăng. Lượng tỏi, ớt và đinh lăng theo lựa chọn của bạn.",
    image: "/assets/nem-truyen-thong.png",
    gallery: ["/assets/nem-truyen-thong.png", "/assets/hero.png", "/assets/story.png"],
    rating: 4.9,
    soldCount: 3820,
    isBestSeller: true,
    isFeatured: true,
    defaultSpices: { garlic: "Nhiều", chili: "Ít", polyscias: "Nhiều" },
  },
  {
    name: "Nem chua lá ổi",
    slug: "nem-chua-la-oi",
    category: "nem-huong-la",
    categoryName: "Nem hương lá",
    price: 95000,
    unit: "gói 10 chiếc",
    sku: "NN-LO-10",
    stock: 76,
    pack: "10 chiếc · 200 g / gói",
    badge: "Thơm hương lá",
    shortDesc: "10 chiếc · 200 g",
    storage: "Giữ lạnh 0–4°C. Xem hạn dùng trên nhãn từng mẻ.",
    description: "Nem chua gói cùng lá ổi, dậy hương lá thanh nhẹ, chua dịu vừa miệng.",
    longDesc: "Từng gói nem được ủ cùng lá ổi, tạo lớp hương thơm riêng biệt bên cạnh vị chua quen thuộc.",
    ingredients: "Thịt heo, bì heo, thính gạo, lá ổi, gia vị, tỏi, ớt, đinh lăng.",
    image: "/assets/nem-la-oi.png",
    gallery: ["/assets/nem-la-oi.png", "/assets/hero.png"],
    rating: 4.8,
    soldCount: 2450,
    isBestSeller: false,
    isFeatured: true,
    defaultSpices: { garlic: "Nhiều", chili: "Nhiều", polyscias: "Ít" },
  },
  {
    name: "Nem chua cối",
    slug: "nem-chua-coi",
    category: "nem-coi-ran",
    categoryName: "Nem cối & rán",
    price: 180000,
    unit: "cối",
    sku: "NN-CO-500",
    stock: 32,
    pack: "1 cối · 500 g",
    badge: "Đậm vị",
    shortDesc: "1 cối · 500 g",
    storage: "Giữ lạnh 0–4°C. Xem hạn dùng trên nhãn từng mẻ.",
    description: "Cối nem lớn, cắt khoanh dùng cho bàn đông người.",
    longDesc: "Nem cối 500 g, vị đậm, thích hợp buổi sum vầy.",
    ingredients: "Thịt heo, bì heo, thính gạo, gia vị, tỏi, ớt, đinh lăng.",
    image: "/assets/nem-coi.png",
    gallery: ["/assets/nem-coi.png"],
    rating: 5,
    soldCount: 1680,
    isBestSeller: false,
    isFeatured: true,
    defaultSpices: { garlic: "Ít", chili: "Ít", polyscias: "Nhiều" },
  },
  {
    name: "Nem chua rán",
    slug: "nem-chua-ran",
    category: "nem-coi-ran",
    categoryName: "Nem cối & rán",
    price: 110000,
    unit: "túi",
    sku: "NN-RA-500",
    stock: 54,
    pack: "1 túi · 500 g",
    badge: "Món ăn vặt",
    shortDesc: "1 túi · 500 g",
    storage: "Cần làm chín trước khi ăn. Bảo quản lạnh khi chưa rán.",
    description: "Nem rán giòn ngoài, mềm trong — món ăn vặt cho bàn nhậu.",
    longDesc: "Cần làm chín trước khi ăn. Giòn nhẹ, thơm vị nem quen.",
    ingredients: "Thịt heo, bì heo, thính gạo, gia vị, tỏi, ớt.",
    image: "/assets/nem-ran.png",
    gallery: ["/assets/nem-ran.png"],
    rating: 4.7,
    soldCount: 1190,
    isBestSeller: false,
    isFeatured: true,
    defaultSpices: { garlic: "Nhiều", chili: "Ít", polyscias: "Ít" },
  },
];

const combosData = [
  {
    name: "Combo Sum vầy",
    slug: "combo-sum-vay",
    category: "combo",
    price: 235000,
    originalPrice: 265000,
    image: "/assets/combo-sum-vay.png",
    gallery: ["/assets/combo-sum-vay.png"],
    sku: "CB-SV-30",
    badge: "Combo bán chạy",
    serves: "Dành cho 4–6 người",
    soldCount: 940,
    status: "Đang bán",
    pack: "30 chiếc · 600 g / combo",
    shortDesc: "20 nem truyền thống + 10 nem lá ổi",
    description: "Hai vị nem, một bàn chuyện trò. Đủ đầy cho bữa gặp gỡ gia đình hoặc buổi hẹn bạn bè cuối tuần.",
    itemsIncluded: [
      "2 gói nem truyền thống × 10 chiếc (400 g)",
      "1 gói nem lá ổi × 10 chiếc (200 g)",
      "Tổng 30 chiếc · 600 g",
    ],
    comboItems: [
      {
        productSlug: "nem-chua-truyen-thong",
        name: "Nem chua truyền thống",
        qty: 2,
        qtyLabel: "2 gói × 10 chiếc · 400 g",
        image: "/assets/nem-truyen-thong.png",
        defaultSpices: { garlic: "Ít", chili: "Ít", polyscias: "Nhiều" },
      },
      {
        productSlug: "nem-chua-la-oi",
        name: "Nem chua lá ổi",
        qty: 1,
        qtyLabel: "1 gói × 10 chiếc · 200 g",
        image: "/assets/nem-la-oi.png",
        defaultSpices: { garlic: "Nhiều", chili: "Nhiều", polyscias: "Ít" },
      },
    ],
    defaultSpices: { garlic: "Ít", chili: "Ít", polyscias: "Nhiều" },
  },
  {
    name: "Combo Gói thương",
    slug: "combo-goi-thuong",
    category: "combo",
    price: 335000,
    originalPrice: 360000,
    image: "/assets/combo-goi-thuong.png",
    gallery: ["/assets/combo-goi-thuong.png"],
    sku: "CB-GT-21",
    badge: "Quà tặng",
    soldCount: 620,
    status: "Đang bán",
    pack: "20 chiếc + 1 cối · Kèm hộp quà",
    shortDesc: "10 nem truyền thống + 10 nem lá ổi + 1 cối 500 g",
    description: "Một hộp quà đủ vị: nem quen, nem lá và một cối lớn để bàn thêm ấm.",
    itemsIncluded: [
      "10 nem truyền thống",
      "10 nem lá ổi",
      "1 cối 500 g",
    ],
    comboItems: [
      {
        productSlug: "nem-chua-truyen-thong",
        name: "Nem chua truyền thống",
        qty: 1,
        qtyLabel: "1 gói × 10 chiếc · 200 g",
        image: "/assets/nem-truyen-thong.png",
        defaultSpices: { garlic: "Nhiều", chili: "Ít", polyscias: "Nhiều" },
      },
      {
        productSlug: "nem-chua-la-oi",
        name: "Nem chua lá ổi",
        qty: 1,
        qtyLabel: "1 gói × 10 chiếc · 200 g",
        image: "/assets/nem-la-oi.png",
        defaultSpices: { garlic: "Nhiều", chili: "Ít", polyscias: "Nhiều" },
      },
      {
        productSlug: "nem-chua-coi",
        name: "Nem chua cối",
        qty: 1,
        qtyLabel: "1 cối · 500 g",
        image: "/assets/nem-coi.png",
        defaultSpices: { garlic: "Ít", chili: "Ít", polyscias: "Nhiều" },
      },
    ],
    defaultSpices: { garlic: "Nhiều", chili: "Ít", polyscias: "Nhiều" },
  },
];

const seedData = async () => {
  try {
    console.log("🌱 Bắt đầu seed dữ liệu vào MongoDB...");
    await connectDB();

    // 1. Seed Users
    console.log("➡️ Đang tạo Users...");
    await User.deleteMany({});
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error("Thiếu ADMIN_PASSWORD trong .env — đặt mật khẩu admin trước khi seed.");
    }
    const adminUser = await User.create({
      name: "Quản trị viên Nếp Nem",
      email: process.env.ADMIN_EMAIL || "0936993543@nepnem.vn",
      phone: process.env.ADMIN_PHONE || "0936993543",
      password: adminPassword,
      role: "admin",
      avatar: "/assets/user.svg",
    });

    const normalUser = await User.create({
      name: "Nguyễn Thùy Linh",
      email: "khachhang@nepnem.vn",
      phone: "0900000128",
      password: "user",
      role: "user",
      avatar: "/assets/user.svg",
      address: "24 ngõ Hoa, phường Bồ Đề, Hà Nội",
    });
    console.log("✅ Đã tạo xong tài khoản Admin & User!");

    // 2. Seed Categories
    console.log("➡️ Đang tạo Categories...");
    await Category.deleteMany({});
    await Category.insertMany(categoriesData);
    console.log("✅ Đã tạo xong Categories!");

    // 3. Seed Products
    console.log("➡️ Đang tạo Products...");
    await Product.deleteMany({});
    await Product.insertMany(productsData);
    console.log("✅ Đã tạo xong Products!");

    // 4. Seed Combos
    console.log("➡️ Đang tạo Combos...");
    await Combo.deleteMany({});
    await Combo.insertMany(combosData);
    console.log("✅ Đã tạo xong Combos!");

    // 5. Seed Sample Orders
    console.log("➡️ Đang tạo Orders mẫu...");
    await Order.deleteMany({});
    await Order.create([
      {
        orderCode: "NN0611-028",
        userId: normalUser._id,
        customerName: "Nguyễn Thùy Linh",
        phone: "0900 000 128",
        email: "khachhang@nepnem.vn",
        address: "24 ngõ Hoa, phường Bồ Đề, Hà Nội",
        desiredEatTime: "08/11/2026 · 18:30",
        note: "Gọi trước 20 phút, không bấm chuông. Nhà có em bé.",
        paymentMethod: "COD",
        paymentStatus: "Chưa thanh toán",
        status: "Chờ xác nhận",
        source: "Cửa hàng trực tuyến",
        subtotal: 490000,
        shippingFee: 30000,
        totalAmount: 520000,
        timeline: [
          { time: "09:42 · 06/11", title: "Khách đặt đơn trên cửa hàng", done: true },
          { time: "09:43 · 06/11", title: "Đã lưu gia vị, ghi chú và thời điểm sử dụng", done: true },
          { time: "", title: "Liên hệ khách, xác nhận lịch giao phù hợp", done: false, current: true },
        ],
        items: [
          {
            productSlug: "nem-chua-truyen-thong",
            name: "Nem chua truyền thống",
            image: "/assets/nem-truyen-thong.png",
            pack: "10 chiếc · 200 g / gói",
            price: 85000,
            quantity: 2,
            unit: "gói",
            spices: { garlic: "Nhiều", chili: "Ít", polyscias: "Nhiều" },
            tag: "Phần thơm tỏi · Nhẹ ớt",
          },
          {
            productSlug: "nem-chua-truyen-thong",
            name: "Nem chua truyền thống",
            image: "/assets/nem-truyen-thong.png",
            pack: "10 chiếc · 200 g / gói",
            price: 85000,
            quantity: 1,
            unit: "gói",
            spices: { garlic: "Ít", chili: "Nhiều", polyscias: "Ít" },
            tag: "Phần nhẹ tỏi · Đậm ớt",
          },
          {
            productSlug: "combo-sum-vay",
            name: "Combo Sum vầy",
            image: "/assets/combo-sum-vay.png",
            isCombo: true,
            pack: "30 chiếc · 600 g / combo",
            price: 235000,
            quantity: 1,
            unit: "combo",
            comboSubItems: [
              {
                name: "Nem truyền thống",
                qtyText: "2 gói × 10 chiếc",
                spices: { garlic: "Ít", chili: "Ít", polyscias: "Nhiều" },
              },
              {
                name: "Nem lá ổi",
                qtyText: "1 gói × 10 chiếc",
                spices: { garlic: "Nhiều", chili: "Nhiều", polyscias: "Ít" },
              },
            ],
          },
        ],
      },
      {
        orderCode: "NN0611-027",
        customerName: "Trần Minh Anh",
        phone: "0900 000 127",
        email: "minhanh.tran@example.com",
        address: "18 phố Tràng Tiền, Hoàn Kiếm, Hà Nội",
        desiredEatTime: "07/11/2026 · 12:00",
        note: "",
        paymentMethod: "COD",
        paymentStatus: "Chưa thanh toán",
        status: "Đang chuẩn bị",
        source: "Cửa hàng trực tuyến",
        subtotal: 335000,
        shippingFee: 30000,
        totalAmount: 365000,
        assignee: "An Nguyễn",
        scheduleNote: "Giao trước 11:30",
        timeline: [
          { time: "09:18 · 06/11", title: "Khách đặt đơn trên cửa hàng", done: true },
          { time: "09:19 · 06/11", title: "Đã lưu gia vị, ghi chú và thời điểm sử dụng", done: true },
          { time: "", title: "Liên hệ khách, xác nhận lịch giao phù hợp", done: false, current: true },
        ],
        items: [
          {
            productSlug: "combo-goi-thuong",
            name: "Combo Gói thương",
            image: "/assets/combo-goi-thuong.png",
            price: 335000,
            quantity: 1,
            unit: "combo",
            isCombo: true,
          },
        ],
      },
    ]);
    console.log("✅ Đã tạo xong Orders mẫu!");

    console.log("🎉 TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC SEED THÀNH CÔNG VÀO MONGODB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed dữ liệu:", error);
    process.exit(1);
  }
};

seedData();

