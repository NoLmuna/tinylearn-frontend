/* eslint-disable no-undef */
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { User, Lesson } = require('../models/database');
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
    },

    // Get parent's children data
    getParentChildren: async (req, res) => {
        try {
            const parentId = req.user.id;

            if (req.user.role !== 'parent') {
                return send.sendResponseMessage(res, 403, null, 'Access denied. Parent role required.');
            }

            // Get all student-parent relationships for this parent
            const { StudentParent, Progress, Assignment, Submission } = require('../models');
            
            const childrenRelations = await StudentParent.findAll({
                where: { parentId },
                include: [
                    {
                        model: User,
                        as: 'student',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'age', 'grade', 'profilePicture'],
                        include: [
                            {
                                model: Progress,
                                as: 'progress',
                                include: [
                                    {
                                        model: Lesson,
                                        as: 'lesson',
                                        attributes: ['id', 'title', 'category', 'difficulty']
                                    }
                                ]
                            },
                            {
                                model: Submission,
                                as: 'submissions',
                                include: [
                                    {
                                        model: Assignment,
                                        as: 'assignment',
                                        attributes: ['id', 'title', 'dueDate', 'maxPoints']
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            // Transform the data to include calculated statistics
            const children = childrenRelations.map(relation => {
                const student = relation.student;
                const progress = student.progress || [];
                const submissions = student.submissions || [];

                // Calculate progress statistics
                const completedLessons = progress.filter(p => p.status === 'completed').length;
                const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
                const scores = progress.filter(p => p.score !== null).map(p => p.score);
                const averageScore = scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
                
                // Calculate current streak (consecutive days with activity)
                const recentProgress = progress
                    .filter(p => p.completedAt)
                    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
                
                let streak = 0;
                const today = new Date();
                for (let i = 0; i < recentProgress.length; i++) {
                    const progressDate = new Date(recentProgress[i].completedAt);
                    const daysDiff = Math.floor((today - progressDate) / (1000 * 60 * 60 * 24));
                    if (daysDiff === i) {
                        streak++;
                    } else {
                        break;
                    }
                }

                // Get recent activities (last 5 completed lessons)
                const recentActivities = progress
                    .filter(p => p.status === 'completed' && p.score !== null)
                    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                    .slice(0, 5)
                    .map(p => ({
                        id: p.id,
                        lesson: p.lesson?.title || 'Unknown Lesson',
                        score: p.score,
                        date: p.completedAt,
                        category: p.lesson?.category || 'general'
                    }));

                // Get upcoming assignments
                const upcomingAssignments = submissions
                    .filter(s => s.assignment && new Date(s.assignment.dueDate) > new Date())
                    .sort((a, b) => new Date(a.assignment.dueDate) - new Date(b.assignment.dueDate))
                    .slice(0, 3)
                    .map(s => ({
                        id: s.assignment.id,
                        title: s.assignment.title,
                        dueDate: s.assignment.dueDate,
                        status: s.status,
                        maxPoints: s.assignment.maxPoints
                    }));

                return {
                    id: student.id,
                    name: `${student.firstName} ${student.lastName}`,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    age: student.age,
                    grade: student.grade,
                    profilePicture: student.profilePicture,
                    recentProgress: {
                        lessonsCompleted: completedLessons,
                        averageScore,
                        timeSpent: `${Math.round(totalTimeSpent / 60)} hours`,
                        streak
                    },
                    recentActivities,
                    upcomingAssignments,
                    relationship: relation.relationship
                };
            });

            return send.sendResponseMessage(res, 200, { children }, 'Parent children data retrieved successfully');
        } catch (error) {
            console.error('Get parent children error:', error);
            return send.sendErrorMessage(res, 500, error);
        }
    },

    // Get students for teacher (or all users for admin)
    getUsersByRole: async (req, res) => {
        try {
            const { role } = req.query;
            let users;

            if (req.user.role === 'admin') {
                // Admin can access all users
                const whereClause = role ? { role } : {};
                users = await User.findAll({
                    where: whereClause,
                    attributes: { exclude: ['password'] },
                    order: [['createdAt', 'DESC']]
                });
            } else if (req.user.role === 'teacher') {
                // Teacher can only access students
                users = await User.findAll({
                    where: { role: 'student' },
                    attributes: { exclude: ['password'] },
                    order: [['createdAt', 'DESC']]
                });
            } else {
                return send.sendResponseMessage(res, 403, null, 'Access denied. Insufficient permissions.');
            }

            return send.sendResponseMessage(res, 200, users, 'Users retrieved successfully');
        } catch (error) {
            console.error('Get users by role error:', error);
            return send.sendErrorMessage(res, 500, error);
        }
    }
};

module.exports = UserController;

