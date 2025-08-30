/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/user-guard');
const userController = require('../controllers/UserController');

// Public routes
router.post('/login', userController.userLogin);

// Protected routes (require authentication)
router.get('/profile', authGuard, userController.getProfile);
router.get('/all', authGuard, userController.getAllUsers);
router.get('/by-role', authGuard, userController.getUsersByRole);
router.get('/parent/children', authGuard, userController.getParentChildren);
router.get('/parent/teachers', authGuard, userController.getTeachersForParent);
router.get('/teacher/parents', authGuard, userController.getParentsForTeacher);

// Admin-only routes (specific routes BEFORE parameterized routes)
router.post('/register', authGuard, userController.registerUser);
router.get('/stats', authGuard, userController.getSystemStats);
router.get('/:userId', authGuard, userController.getUserById);
router.put('/:userId', authGuard, userController.updateUser);
router.delete('/:userId', authGuard, userController.deleteUser);

module.exports = router;