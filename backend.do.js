// Durable Object chạy toàn bộ app Express + Mongoose trên Cloudflare Workers.
//
// Cloudflare Workers không tái sử dụng I/O (socket TCP) giữa các request,
// nên connection pool MongoDB trong Worker có thể bị treo từ request thứ 2.
// Durable Object giữ isolate + connection sống giữa các request.
import { DurableObject } from 'cloudflare:workers';
import { handleAsNodeRequest } from 'cloudflare:node';

const NODE_SERVER_PORT = 3000;

let appPromise = null;

export class BackendDO extends DurableObject {
  constructor(state, env) {
    super(state, env);

    if (!appPromise) {
      // Đưa vars/secrets (MONGODB_URI, JWT_SECRET...) ra cho config/env.js đọc
      globalThis.__WORKER_ENV__ = env;

      appPromise = import('./app.js').then((appModule) => {
        const app = appModule.default ?? appModule;
        app.listen(NODE_SERVER_PORT);
        return app;
      });
    }
  }

  async fetch(request) {
    await appPromise;
    return handleAsNodeRequest(NODE_SERVER_PORT, request);
  }
}
