import * as dotenv from 'dotenv';
dotenv.config();

type EnvConfig = {
    NODE_ENV: string;
    PORT: number;
    CLOUDINARY_API_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    MONGO_DB_STRING: string;
    APP_VERSION: string;
    OTP_TTL: string;

    AI_MS_PORT: number;
    NOTIFIER_MS_PORT: number;

    ENCRYPTION_KEY: string;
}

const env: EnvConfig = process.env as unknown as EnvConfig;
type EnvironmentType = 'development' | 'staging' | 'production' | 'test';

export const appEnv: EnvironmentType = (env.NODE_ENV as EnvironmentType) || 'development';
export const PORT: number = env.PORT || 3000;
export const APP_VERSION = env.APP_VERSION || 'v1';
export const DB_STRING = env.MONGO_DB_STRING;
export const OTP_TTL = env.OTP_TTL || 5;

export const ENCRYPTION_KEY = env.ENCRYPTION_KEY;

export const CLOUDINARY_CONFIG = {
    cloud_name: env.CLOUDINARY_API_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
}
export const MICROSERVICE_PORTS = {
    AI: env.AI_MS_PORT || 2001,
    NOTIFIER: env.NOTIFIER_MS_PORT || 2002
}