import * as dotenv from 'dotenv';
dotenv.config();

type EnvConfig = {
    NODE_ENV: string;
    PORT: number;
    CLOUDINARY_API_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    MONGO_DB_STRING: string;
}

const env: EnvConfig = process.env as unknown as EnvConfig;
type EnvironmentType = 'development' | 'staging' | 'production' | 'test';

export const appEnv: EnvironmentType = (env.NODE_ENV as EnvironmentType) || 'development';
export const PORT: number = env.PORT || 3000;

export const DB_STRING = env.MONGO_DB_STRING;