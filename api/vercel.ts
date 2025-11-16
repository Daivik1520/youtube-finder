import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Vercel serverless function wrapper for Express app
const app = require('./server.ts').default;

export default app;