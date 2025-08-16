/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const ProgressController = require('../controllers/ProgressController');
const authGuard = require('../middleware/user-guard');

// All progress routes require authentication
router.get('/', authGuard, ProgressController.getUserProgress);
router.get('/stats', authGuard, ProgressController.getProgressStats);
router.get('/all', authGuard, ProgressController.getAllProgress);
router.get('/lesson/:lessonId', authGuard, ProgressController.getLessonProgress);
router.post('/lesson/:lessonId/start', authGuard, ProgressController.startLesson);
router.put('/lesson/:lessonId', authGuard, ProgressController.updateProgress);
router.put('/lesson/:lessonId/complete', authGuard, ProgressController.completeLesson);

module.exports = router;
