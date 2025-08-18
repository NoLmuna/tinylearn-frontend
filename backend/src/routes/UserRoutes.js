/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/user-guard');
const userController = require('../controllers/UserController');

// Public routes
router.post('/login', userController.userLogin);
router.post('/register', userController.registerUser);

// Protected routes (require authentication)
router.get('/profile', authGuard, userController.getProfile);
router.put('/profile', authGuard, userController.updateProfile);
router.get('/all', authGuard, userController.getAllUsers);

// Admin-only routes
router.post('/create-student', authGuard, userController.createStudentAccount);
router.put('/approve-teacher/:userId', authGuard, userController.approveTeacher);
router.get('/pending-teachers', authGuard, userController.getPendingTeachers);

module.exports = router;