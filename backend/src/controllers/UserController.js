/* eslint-disable no-undef */
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { User } = require('../models/database');
const send = require('../utils/response');

const UserController = {
    // Register a new user with role-based restrictions
    registerUser: async (req, res) => {
        try {
            const { firstName, lastName, email, password, role, age, grade, parentEmail } = req.body;

            // Validate required fields
            if (!firstName || !lastName || !email || !password) {
                return send.sendResponseMessage(res, 400, null, 'First name, last name, email, and password are required');
            }

            // Role-based registration restrictions
            const requestedRole = role || 'student';
            
            // Only allow parent and teacher self-registration
            if (!['parent', 'teacher'].includes(requestedRole)) {
                return send.sendResponseMessage(res, 403, null, 'Students and admin accounts must be created by administrators');
            }

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return send.sendResponseMessage(res, 409, null, 'User with this email already exists');
            }

            // Hash password
            const hashedPassword = await argon2.hash(password);

            // Set account status based on role
            let accountStatus = 'approved';
            if (requestedRole === 'teacher') {
                accountStatus = 'pending'; // Teachers need admin approval
            }

            // Create user
            const newUser = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: requestedRole,
                age,
                grade,
                parentEmail,
                accountStatus
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
                accountStatus: newUser.accountStatus,
                createdAt: newUser.createdAt
            };

            const message = requestedRole === 'teacher' 
                ? 'Teacher account created successfully. Please wait for admin approval.' 
                : 'Parent account created successfully.';

            return send.sendResponseMessage(res, 201, userResponse, message);
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

            // Check account status
            if (existingUser.accountStatus === 'pending') {
                return send.sendResponseMessage(res, 401, null, 'Account is pending approval. Please wait for admin approval.');
            }

            if (existingUser.accountStatus === 'suspended') {
                return send.sendResponseMessage(res, 401, null, 'Account is suspended. Please contact support.');
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
    },

    // Admin-only: Create student account
    createStudentAccount: async (req, res) => {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
                return send.sendResponseMessage(res, 403, null, 'Access denied. Admin or teacher role required.');
            }

            const { firstName, lastName, email, password, age, grade, parentEmail } = req.body;

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

            // Create student
            const newStudent = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: 'student',
                age,
                grade,
                parentEmail,
                accountStatus: 'approved',
                createdBy: req.user.id
            });

            // Remove password from response
            const studentResponse = {
                id: newStudent.id,
                firstName: newStudent.firstName,
                lastName: newStudent.lastName,
                email: newStudent.email,
                role: newStudent.role,
                age: newStudent.age,
                grade: newStudent.grade,
                parentEmail: newStudent.parentEmail,
                isActive: newStudent.isActive,
                accountStatus: newStudent.accountStatus,
                createdBy: newStudent.createdBy,
                createdAt: newStudent.createdAt
            };

            return send.sendResponseMessage(res, 201, studentResponse, 'Student account created successfully');
        } catch (error) {
            console.error('Create student error:', error);
            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map(err => err.message);
                return send.sendResponseMessage(res, 400, null, `Validation error: ${validationErrors.join(', ')}`);
            }
            return send.sendErrorMessage(res, 500, error);
        }
    },

    // Admin-only: Approve teacher account
    approveTeacher: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return send.sendResponseMessage(res, 403, null, 'Access denied. Admin role required.');
            }

            const { userId } = req.params;
            const { approve } = req.body; // true or false

            const teacher = await User.findByPk(userId);
            if (!teacher) {
                return send.sendResponseMessage(res, 404, null, 'Teacher not found');
            }

            if (teacher.role !== 'teacher') {
                return send.sendResponseMessage(res, 400, null, 'User is not a teacher');
            }

            const newStatus = approve ? 'approved' : 'suspended';
            await teacher.update({ accountStatus: newStatus });

            const message = approve ? 'Teacher approved successfully' : 'Teacher suspended successfully';
            
            const teacherResponse = {
                id: teacher.id,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                email: teacher.email,
                role: teacher.role,
                accountStatus: newStatus
            };

            return send.sendResponseMessage(res, 200, teacherResponse, message);
        } catch (error) {
            console.error('Approve teacher error:', error);
            return send.sendErrorMessage(res, 500, error);
        }
    },

    // Get pending teachers (admin only)
    getPendingTeachers: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return send.sendResponseMessage(res, 403, null, 'Access denied. Admin role required.');
            }

            const pendingTeachers = await User.findAll({
                where: { 
                    role: 'teacher',
                    accountStatus: 'pending'
                },
                attributes: { exclude: ['password'] },
                order: [['createdAt', 'DESC']]
            });

            return send.sendResponseMessage(res, 200, pendingTeachers, 'Pending teachers retrieved successfully');
        } catch (error) {
            console.error('Get pending teachers error:', error);
            return send.sendErrorMessage(res, 500, error);
        }
    },

    // Delete a user (admin only)
    deleteUser: async (req, res) => {
        try {
            const { userId } = req.params;

            // Check if user exists
            const user = await User.findByPk(userId);
            if (!user) {
                return send.sendResponseMessage(res, 404, null, 'User not found');
            }

            // Prevent admin from deleting themselves
            if (req.user && req.user.id === parseInt(userId)) {
                return send.sendResponseMessage(res, 400, null, 'Cannot delete your own account');
            }

            // Delete the user
            await user.destroy();

            return send.sendResponseMessage(res, 200, null, 'User deleted successfully');
        } catch (error) {
            console.error('Delete user error:', error);
            return send.sendErrorMessage(res, 500, error);
        }
    }
};

module.exports = UserController;

