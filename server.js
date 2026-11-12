require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("-----------------------------------");
  console.log("✅ BACKEND KHỞI ĐỘNG THÀNH CÔNG");
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
  console.log("-----------------------------------");
});
