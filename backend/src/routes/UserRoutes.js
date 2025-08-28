/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/user-guard');
const userController = require('../controllers/UserController');

// Public routes
router.post('/login', userController.userLogin);

// Protected routes (require authentication)
router.get('/profile', authGuard, userController.getProfile);
router.put('/profile', authGuard, userController.updateProfile);
router.get('/all', authGuard, userController.getAllUsers);
router.get('/by-role', authGuard, userController.getUsersByRole);
router.get('/parent/children', authGuard, userController.getParentChildren);

// Admin-only routes
router.post('/register', authGuard, userController.registerUser); // Admin creates accounts
router.post('/create-student', authGuard, userController.createStudentAccount);
router.put('/approve-teacher/:userId', authGuard, userController.approveTeacher);
router.get('/pending-teachers', authGuard, userController.getPendingTeachers);
router.delete('/:userId', authGuard, userController.deleteUser); // Admin deletes users

module.exports = router;