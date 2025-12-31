/**
 * Environment configuration with type safety
 */

interface EnvConfig {
    NEXT_PUBLIC_API_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
}

function getEnvVar(key: keyof EnvConfig): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Environment variable ${key} is not defined`);
    }

    return value;
}

export const env: EnvConfig = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
};

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
