/* eslint-disable no-undef */

/**
 * Standard API response utility
 */
class ApiResponse {
    /**
     * Send success response
     * @param {Object} res - Express response object
     * @param {number} status - HTTP status code
     * @param {any} data - Response data
     * @param {string} message - Success message
     */
    static success(res, status = 200, data = null, message = 'Success') {
        return res.status(status).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Send error response
     * @param {Object} res - Express response object
     * @param {number} status - HTTP status code
     * @param {string} message - Error message
     * @param {any} error - Error details (only in development)
     */
    static error(res, status = 500, message = 'Internal Server Error', error = null) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        // Only include error details in development
        if (process.env.NODE_ENV === 'development' && error) {
            response.error = {
                message: error.message,
                stack: error.stack
            };
        }

        return res.status(status).json(response);
    }

    /**
     * Send validation error response
     * @param {Object} res - Express response object
     * @param {string|Array} errors - Validation errors
     */
    static validationError(res, errors) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: Array.isArray(errors) ? errors : [errors],
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Send unauthorized response
     * @param {Object} res - Express response object
     * @param {string} message - Unauthorized message
     */
    static unauthorized(res, message = 'Unauthorized access') {
        return res.status(401).json({
            success: false,
            message,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Send forbidden response
     * @param {Object} res - Express response object
     * @param {string} message - Forbidden message
     */
    static forbidden(res, message = 'Forbidden access') {
        return res.status(403).json({
            success: false,
            message,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Send not found response
     * @param {Object} res - Express response object
     * @param {string} message - Not found message
     */
    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            success: false,
            message,
            timestamp: new Date().toISOString()
        });
    }
}

// Backward compatibility
const sendResponseMessage = (res, status, data, message) => {
    return ApiResponse.success(res, status, data, message);
};

const sendErrorMessage = (res, status, error) => {
    return ApiResponse.error(res, status, error.message || 'Internal Server Error', error);
};

// Function that matches the expected signature: sendResponse(res, statusCode, status, message, data)
const sendResponse = (res, statusCode, status, message, data = null) => {
    if (status === 'success') {
        return ApiResponse.success(res, statusCode, data, message);
    } else {
        return ApiResponse.error(res, statusCode, message, data);
    }
};

module.exports = {
    ApiResponse,
    sendResponseMessage,
    sendErrorMessage,
    sendResponse
};