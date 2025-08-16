/* eslint-disable no-undef */
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { User } = require('../models/database');
const send = require('../utils/response');

const UserController = {
    // Register a new user
    registerUser: async (req, res) => {
        try {
            const { firstName, lastName, email, password, role, age, grade, parentEmail } = req.body;

            // Validate required fields
            if (!firstName || !lastName || !email || !password) {
                return send.sendResponseMessage(res, 400, null, 'First name, last name, email, and password are required');
            }

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return send.sendResponseMessage(res, 409, null, 'User with this email already exists');
            }

            // Hash password
            const hashedPassword = await argon2.hash(password);

            // Create user
            const newUser = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: role || 'student',
                age,
                grade,
                parentEmail
            });

            // Remove password from response
            const userResponse = {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
                age: newUser.age,
                grade: newUser.grade,
                parentEmail: newUser.parentEmail,
                isActive: newUser.isActive,
                createdAt: newUser.createdAt
            };

            return send.sendResponseMessage(res, 201, userResponse, 'User registered successfully');
        } catch (error) {
            console.error('Registration error:', error);
            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map(err => err.message);
                return send.sendResponseMessage(res, 400, null, `Validation error: ${validationErrors.join(', ')}`);
            }
            return send.sendErrorMessage(res, 500, error);
        }
    },

    // Login user
    userLogin: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validate required fields
            if (!email || !password) {
                return send.sendResponseMessage(res, 400, null, 'Email and password are required');
            }

            // Find user by email
            const existingUser = await User.findOne({ where: { email } });
            if (!existingUser) {
                return send.sendResponseMessage(res, 404, null, 'User not found');
            }

            // Check if user is active
            if (!existingUser.isActive) {
                return send.sendResponseMessage(res, 401, null, 'Account is deactivated. Please contact support.');
            }

            // Verify password
            const verifyPassword = await argon2.verify(existingUser.password, password);
            if (!verifyPassword) {
                return res.status(401).json({
                    message: "Invalid credentials"
                });
            }

            // Update last login
            await existingUser.update({ lastLogin: new Date() });

            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: existingUser.id,
                    userId: existingUser.id, 
                    email: existingUser.email, 
                    role: existingUser.role 
                },
                process.env.SECRET_KEY || 'your-secret-key',
                { expiresIn: '24h' }
            );

            // User response without password
            const userResponse = {
                id: existingUser.id,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
                role: existingUser.role,
                age: existingUser.age,
                grade: existingUser.grade,
                parentEmail: existingUser.parentEmail,
                isActive: existingUser.isActive,
                lastLogin: existingUser.lastLogin
            };

            return send.sendResponseMessage(res, 200, { user: userResponse, token }, "User logged in successfully!");
        } catch (error) {
            return send.sendErrorMessage(res, 500, error);
        }
    },

    // Get user profile
    getProfile: async (req, res) => {
        try {
            const userId = req.user.userId || req.user.id;

            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return send.sendResponseMessage(res, 404, null, 'User not found');
            }

            return send.sendResponseMessage(res, 200, user, 'Profile retrieved successfully');
        } catch (error) {
            console.error('Get profile error:', error);
            return send.sendErrorMessage(res, 500, error);
        }
    },

    // Update user profile
    updateProfile: async (req, res) => {
        try {
            const userId = req.user.userId || req.user.id;
            const { firstName, lastName, age, grade, parentEmail } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return send.sendResponseMessage(res, 404, null, 'User not found');
            }

            // Update user
            await user.update({
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                age: age || user.age,
                grade: grade || user.grade,
                parentEmail: parentEmail || user.parentEmail
            });

            // Return updated user without password
            const updatedUser = await User.findByPk(userId, {
                attributes: { exclude: ['password'] }
            });

            return send.sendResponseMessage(res, 200, updatedUser, 'Profile updated successfully');
        } catch (error) {
            console.error('Update profile error:', error);
            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map(err => err.message);
                return send.sendResponseMessage(res, 400, null, `Validation error: ${validationErrors.join(', ')}`);
            }
            return send.sendErrorMessage(res, 500, error);
        }
    },

    // Get all users (admin only)
    getAllUsers: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return send.sendResponseMessage(res, 403, null, 'Access denied. Admin role required.');
            }

            const users = await User.findAll({
                attributes: { exclude: ['password'] },
                order: [['createdAt', 'DESC']]
            });

            return send.sendResponseMessage(res, 200, users, 'Users retrieved successfully');
        } catch (error) {
            console.error('Get all users error:', error);
            return send.sendErrorMessage(res, 500, error);
        }
    }
};

module.exports = UserController;

