/* eslint-disable no-undef */
const { ApiResponse } = require("../utils/response");

/**
 * Global error handling middleware
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
    console.error('🚨 Error occurred:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Handle specific error types
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => err.message);
        return ApiResponse.validationError(res, errors);
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
        return ApiResponse.error(res, 409, 'Resource already exists');
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return ApiResponse.error(res, 400, 'Invalid reference to related resource');
    }

    if (error.name === 'CastError') {
        return ApiResponse.error(res, 400, 'Invalid data format');
    }

    // Default error response
    const status = error.status || error.statusCode || 500;
    const message = error.message || 'Internal server error';
    
    return ApiResponse.error(res, status, message, error);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    return ApiResponse.notFound(res, `Route ${req.method} ${req.url} not found`);
};

/**
 * Async error wrapper
 * Wraps async functions to catch errors and pass them to error handler
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler
};
