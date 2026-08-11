import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Reads a required environment variable. The process exits on boot when the
 * variable is missing, so a deployment can never silently fall back to a
 * hardcoded value.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    console.error(
      `[config] Missing required environment variable: ${name}. ` +
      `Set it before starting the server.`
    );
    process.exit(1);
  }
  return value.trim();
}

export const JWT_SECRET = requireEnv('JWT_SECRET');

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PROD = NODE_ENV === 'production';

export const APP_URL = process.env.APP_URL
  ? process.env.APP_URL.replace(/['"]/g, '').trim().replace(/\/$/, '')
  : 'http://localhost:5001';
