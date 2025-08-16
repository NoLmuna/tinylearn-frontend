/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        // Check for authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access token required"
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token required"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'your-secret-key');
        
        // Add user data to request object
        req.user = decoded;
        req.userData = decoded; // Keep for backward compatibility
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token has expired"
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        
        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
}