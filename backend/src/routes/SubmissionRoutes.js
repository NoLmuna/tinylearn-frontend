/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const SubmissionController = require('../controllers/SubmissionController');
const userGuard = require('../middleware/user-guard');

// Protected routes - all submission routes require authentication
router.use(userGuard);

// Create or update submission (students only)
router.post('/', SubmissionController.createOrUpdateSubmission);

// Submit submission (change from draft to submitted)
router.patch('/:id/submit', SubmissionController.submitSubmission);

// Grade submission (teachers only)
router.patch('/:id/grade', SubmissionController.gradeSubmission);

// Get submissions
router.get('/student', SubmissionController.getStudentSubmissions);
router.get('/assignment/:assignmentId', SubmissionController.getAssignmentSubmissions);

// Get specific submission
router.get('/:id', SubmissionController.getSubmissionById);

module.exports = router;
