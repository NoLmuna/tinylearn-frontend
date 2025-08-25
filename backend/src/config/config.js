/* eslint-disable no-undef */
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['HOST', 'USER', 'DB_NAME', 'DIALECT', 'SECRET_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

const config = {
    database: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD || '',
        database: process.env.DB_NAME,
        dialect: process.env.DIALECT,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    jwt: {
        secret: process.env.JWT_SECRET || process.env.SECRET_KEY,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    server: {
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || 'development'
    }
};

// Backward compatibility - export old format for existing imports
module.exports = {
    ...config.database,
    config
};
