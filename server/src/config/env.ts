import dotenv from 'dotenv';
import path from 'path';

// Load .env file with fallbacks
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const getEnvVar = (name: string, required = false, defaultValue = ''): string => {
  const value = process.env[name];
  if (!value && required && !defaultValue) {
    throw new Error(`Environment variable ${name} is missing.`);
  }
  return value || defaultValue;
};

export const env = {
  PORT: parseInt(getEnvVar('PORT', false, '5000'), 10),
  MONGODB_URI: getEnvVar('MONGODB_URI', false, 'mongodb://localhost:27017/capgemini-prep'),
  JWT_SECRET: getEnvVar('JWT_SECRET', false, 'capgemini-prep-jwt-secret-dev-2026'),
  JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET', false, 'capgemini-prep-refresh-secret-dev-2026'),
  JWT_EXPIRE: getEnvVar('JWT_EXPIRE', false, '15m'),
  JWT_REFRESH_EXPIRE: getEnvVar('JWT_REFRESH_EXPIRE', false, '7d'),
  FRONTEND_URL: getEnvVar('FRONTEND_URL', false, 'http://localhost:5173'),
  AI_API_KEY: getEnvVar('AI_API_KEY', false),
  AI_PROVIDER: getEnvVar('AI_PROVIDER', false, 'gemini'),
  ADMIN_EMAIL: getEnvVar('ADMIN_EMAIL', false, 'admin@capgemini-prep.com'),
  ADMIN_PASSWORD: getEnvVar('ADMIN_PASSWORD', false, 'Admin@123456'),
  NODE_ENV: getEnvVar('NODE_ENV', false, 'development'),
  JUDGE0_API_URL: getEnvVar('JUDGE0_API_URL', false, 'https://judge0-ce.p.rapidapi.com'),
  JUDGE0_API_KEY: getEnvVar('JUDGE0_API_KEY', false),
};
