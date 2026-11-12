// Đọc biến môi trường cho cả 2 môi trường:
//  - Node thường (local): process.env (dotenv nạp từ .env)
//  - Cloudflare Workers: worker.js gán secrets/vars vào globalThis.__WORKER_ENV__
const onWorkers =
  typeof globalThis !== "undefined" &&
  globalThis.__WORKER_ENV__ &&
  typeof globalThis.__WORKER_ENV__ === "object";

const getEnv = (key, fallback = "") => {
  const fromProcess = typeof process !== "undefined" && process.env ? process.env[key] : undefined;
  if (fromProcess) return fromProcess;
  if (onWorkers && globalThis.__WORKER_ENV__[key]) return globalThis.__WORKER_ENV__[key];
  return fallback;
};

module.exports = { getEnv, onWorkers };
