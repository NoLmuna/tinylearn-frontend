/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const { ApiResponse } = require("../utils/response");
const config = require("../config/config");

/**
 * Authentication middleware
 */
const authenticate = (req, res, next) => {
    try {
        // Check for authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return ApiResponse.unauthorized(res, "Access token required");
        }

        // Extract token
        const token = authHeader.split(" ")[1];
        if (!token) {
            return ApiResponse.unauthorized(res, "Access token required");
        }

        // Verify token
        const decoded = jwt.verify(token, config.config.jwt.secret);
        
        // Add user data to request object
        req.user = decoded;
        req.userData = decoded; // Keep for backward compatibility
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return ApiResponse.unauthorized(res, "Token has expired");
        } else if (error.name === 'JsonWebTokenError') {
            return ApiResponse.unauthorized(res, "Invalid token");
        }
        
        return ApiResponse.unauthorized(res, "Authentication failed");
    }
};

/**
 * Authorization middleware factory
 * @param {string|Array} allowedRoles - Roles allowed to access the route
 */
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return ApiResponse.unauthorized(res, "Authentication required");
        }

        const userRole = req.user.role;
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!roles.includes(userRole)) {
            return ApiResponse.forbidden(res, `Access denied. Required role: ${roles.join(' or ')}`);
        }

        next();
    };
};

module.exports = authenticate;
module.exports.authenticate = authenticate;
module.exports.authorize = authorize;
