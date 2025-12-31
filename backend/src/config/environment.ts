import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI ,
  JWT_SECRET: process.env.JWT_SECRET ,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
