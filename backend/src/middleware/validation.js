/* eslint-disable no-undef */
const { ApiResponse } = require("../utils/response");

/**
 * Input validation utility
 */
class Validator {
    /**
     * Validate email format
     * @param {string} email 
     * @returns {boolean}
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate password strength
     * @param {string} password 
     * @returns {object}
     */
    static validatePassword(password) {
        const errors = [];
        
        if (!password) {
            errors.push("Password is required");
            return { isValid: false, errors };
        }
        
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }
        
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push("Password must contain at least one lowercase letter");
        }
        
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
        }
        
        if (!/(?=.*\d)/.test(password)) {
            errors.push("Password must contain at least one number");
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate required fields
     * @param {object} data 
     * @param {array} requiredFields 
     * @returns {object}
     */
    static validateRequired(data, requiredFields) {
        const errors = [];
        
        for (const field of requiredFields) {
            if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
                errors.push(`${field} is required`);
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate user role
     * @param {string} role 
     * @returns {boolean}
     */
    static isValidRole(role) {
        const validRoles = ['admin', 'teacher', 'parent', 'student'];
        return validRoles.includes(role);
    }

    /**
     * Sanitize string input
     * @param {string} input 
     * @returns {string}
     */
    static sanitizeString(input) {
        if (typeof input !== 'string') return input;
        return input.trim().replace(/[<>]/g, '');
    }
}

/**
 * Validation middleware factory
 * @param {function} validationFunction 
 * @returns {function}
 */
const validateInput = (validationFunction) => {
    return (req, res, next) => {
        const validation = validationFunction(req.body);
        
        if (!validation.isValid) {
            return ApiResponse.validationError(res, validation.errors);
        }
        
        next();
    };
};

/**
 * Common validation functions
 */
const validationRules = {
    userRegistration: (data) => {
        const requiredValidation = Validator.validateRequired(data, ['firstName', 'lastName', 'email', 'password']);
        if (!requiredValidation.isValid) {
            return requiredValidation;
        }

        const errors = [];

        if (!Validator.isValidEmail(data.email)) {
            errors.push("Invalid email format");
        }

        const passwordValidation = Validator.validatePassword(data.password);
        if (!passwordValidation.isValid) {
            errors.push(...passwordValidation.errors);
        }

        if (data.role && !Validator.isValidRole(data.role)) {
            errors.push("Invalid role specified");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    userLogin: (data) => {
        const requiredValidation = Validator.validateRequired(data, ['email', 'password']);
        if (!requiredValidation.isValid) {
            return requiredValidation;
        }

        const errors = [];

        if (!Validator.isValidEmail(data.email)) {
            errors.push("Invalid email format");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    lessonCreation: (data) => {
        return Validator.validateRequired(data, ['title', 'description', 'content', 'category', 'difficulty', 'ageGroup']);
    },

    assignmentCreation: (data) => {
        return Validator.validateRequired(data, ['title', 'description', 'dueDate']);
    }
};

module.exports = {
    Validator,
    validateInput,
    validationRules
};
