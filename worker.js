// Entry point chạy trên Cloudflare Workers.
// - server.js : entry cho Node thường (local)
// - worker.js : entry cho Cloudflare Workers (wrangler.toml -> main = "worker.js")
//
// Mọi request được chuyển vào Durable Object BackendDO — nơi giữ app Express
// và connection MongoDB sống giữa các request.
import { BackendDO } from './backend.do.js';

export { BackendDO };

export default {
  async fetch(request, env) {
    const id = env.BACKEND.idFromName('nepnem-backend-v8');
    const stub = env.BACKEND.get(id, { locationHint: 'apac' });
    return stub.fetch(request);
  },
};
