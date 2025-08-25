/* eslint-disable no-undef */
const { Submission, Assignment, User } = require('../models');
const { sendResponse } = require('../utils/response');

// Create or update a submission
const createOrUpdateSubmission = async (req, res) => {
    try {
        const { assignmentId, content, attachments } = req.body;
        const studentId = req.user.id;

        // Validate that the user is a student
        if (req.user.role !== 'student') {
            return sendResponse(res, 403, 'error', 'Only students can submit assignments');
        }

        // Check if assignment exists and student is assigned
        const assignment = await Assignment.findByPk(assignmentId);
        if (!assignment) {
            return sendResponse(res, 404, 'error', 'Assignment not found');
        }

        if (!assignment.assignedTo.includes(studentId)) {
            return sendResponse(res, 403, 'error', 'You are not assigned to this assignment');
        }

        // Check if assignment is still active and not overdue
        if (!assignment.isActive) {
            return sendResponse(res, 400, 'error', 'This assignment is no longer active');
        }

        // Find existing submission or create new one
        let submission = await Submission.findOne({
            where: { assignmentId, studentId }
        });

        if (submission) {
            // Update existing submission (only if not already graded)
            if (submission.status === 'graded') {
                return sendResponse(res, 400, 'error', 'Cannot modify a graded submission');
            }

            submission = await submission.update({
                content,
                attachments: attachments || [],
                status: 'draft'
            });
        } else {
            // Create new submission
            submission = await Submission.create({
                assignmentId,
                studentId,
                content,
                attachments: attachments || [],
                status: 'draft'
            });
        }

        const submissionWithDetails = await Submission.findByPk(submission.id, {
            include: [
                { model: Assignment, as: 'assignment', attributes: ['id', 'title', 'dueDate'] },
                { model: User, as: 'student', attributes: ['id', 'firstName', 'lastName'] }
            ]
        });

        sendResponse(res, 200, 'success', 'Submission saved successfully', submissionWithDetails);
    } catch (error) {
        console.error('Create/Update submission error:', error);
        sendResponse(res, 500, 'error', 'Failed to save submission');
    }
};

// Submit a submission (change status from draft to submitted)
const submitSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const studentId = req.user.id;

        const submission = await Submission.findOne({
            where: { id, studentId },
            include: [
                { model: Assignment, as: 'assignment' }
            ]
        });

        if (!submission) {
            return sendResponse(res, 404, 'error', 'Submission not found');
        }

        if (submission.status !== 'draft') {
            return sendResponse(res, 400, 'error', 'Submission has already been submitted');
        }

        // Check if assignment is still within due date
        if (new Date(submission.assignment.dueDate) < new Date()) {
            return sendResponse(res, 400, 'error', 'Assignment due date has passed');
        }

        const updatedSubmission = await submission.update({
            status: 'submitted',
            submittedAt: new Date()
        });

        const submissionWithDetails = await Submission.findByPk(updatedSubmission.id, {
            include: [
                { model: Assignment, as: 'assignment', attributes: ['id', 'title', 'dueDate'] },
                { model: User, as: 'student', attributes: ['id', 'firstName', 'lastName'] }
            ]
        });

        sendResponse(res, 200, 'success', 'Submission submitted successfully', submissionWithDetails);
    } catch (error) {
        console.error('Submit submission error:', error);
        sendResponse(res, 500, 'error', 'Failed to submit submission');
    }
};

// Grade a submission (teacher only)
const gradeSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { score, feedback } = req.body;
        const graderId = req.user.id;

        // Validate that the user is a teacher
        if (req.user.role !== 'teacher') {
            return sendResponse(res, 403, 'error', 'Only teachers can grade submissions');
        }

        const submission = await Submission.findByPk(id, {
            include: [
                { 
                    model: Assignment, 
                    as: 'assignment',
                    where: { teacherId: graderId }
                }
            ]
        });

        if (!submission) {
            return sendResponse(res, 404, 'error', 'Submission not found or you do not have permission to grade it');
        }

        if (submission.status !== 'submitted') {
            return sendResponse(res, 400, 'error', 'Can only grade submitted assignments');
        }

        // Validate score
        if (score < 0 || score > submission.assignment.maxPoints) {
            return sendResponse(res, 400, 'error', `Score must be between 0 and ${submission.assignment.maxPoints}`);
        }

        const updatedSubmission = await submission.update({
            score,
            feedback,
            status: 'graded',
            gradedAt: new Date(),
            gradedBy: graderId
        });

        const submissionWithDetails = await Submission.findByPk(updatedSubmission.id, {
            include: [
                { model: Assignment, as: 'assignment', attributes: ['id', 'title', 'maxPoints'] },
                { model: User, as: 'student', attributes: ['id', 'firstName', 'lastName'] },
                { model: User, as: 'grader', attributes: ['id', 'firstName', 'lastName'] }
            ]
        });

        sendResponse(res, 200, 'success', 'Submission graded successfully', submissionWithDetails);
    } catch (error) {
        console.error('Grade submission error:', error);
        sendResponse(res, 500, 'error', 'Failed to grade submission');
    }
};

// Get submissions for a specific assignment (teacher only)
const getAssignmentSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const teacherId = req.user.id;
        const { page = 1, limit = 10, status = 'all' } = req.query;

        // Verify teacher owns the assignment
        const assignment = await Assignment.findOne({
            where: { id: assignmentId, teacherId }
        });

        if (!assignment) {
            return sendResponse(res, 404, 'error', 'Assignment not found or you do not have permission');
        }

        const offset = (page - 1) * limit;
        const whereClause = { assignmentId };

        if (status !== 'all') {
            whereClause.status = status;
        }

        const submissions = await Submission.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, as: 'student', attributes: ['id', 'firstName', 'lastName', 'email'] },
                { model: User, as: 'grader', attributes: ['id', 'firstName', 'lastName'], required: false }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['submittedAt', 'DESC']]
        });

        sendResponse(res, 200, 'success', 'Submissions retrieved successfully', {
            submissions: submissions.rows,
            assignment,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: submissions.count,
                pages: Math.ceil(submissions.count / limit)
            }
        });
    } catch (error) {
        console.error('Get assignment submissions error:', error);
        sendResponse(res, 500, 'error', 'Failed to retrieve submissions');
    }
};

// Get student's own submissions
const getStudentSubmissions = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { page = 1, limit = 10, status = 'all' } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = { studentId };

        if (status !== 'all') {
            whereClause.status = status;
        }

        const submissions = await Submission.findAndCountAll({
            where: whereClause,
            include: [
                { 
                    model: Assignment, 
                    as: 'assignment',
                    attributes: ['id', 'title', 'dueDate', 'maxPoints'],
                    include: [
                        { model: User, as: 'teacher', attributes: ['id', 'firstName', 'lastName'] }
                    ]
                },
                { model: User, as: 'grader', attributes: ['id', 'firstName', 'lastName'], required: false }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['updatedAt', 'DESC']]
        });

        sendResponse(res, 200, 'success', 'Submissions retrieved successfully', {
            submissions: submissions.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: submissions.count,
                pages: Math.ceil(submissions.count / limit)
            }
        });
    } catch (error) {
        console.error('Get student submissions error:', error);
        sendResponse(res, 500, 'error', 'Failed to retrieve submissions');
    }
};

// Get submission by ID
const getSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const submission = await Submission.findByPk(id, {
            include: [
                { 
                    model: Assignment, 
                    as: 'assignment',
                    include: [
                        { model: User, as: 'teacher', attributes: ['id', 'firstName', 'lastName'] }
                    ]
                },
                { model: User, as: 'student', attributes: ['id', 'firstName', 'lastName'] },
                { model: User, as: 'grader', attributes: ['id', 'firstName', 'lastName'], required: false }
            ]
        });

        if (!submission) {
            return sendResponse(res, 404, 'error', 'Submission not found');
        }

        // Check permissions
        if (userRole === 'student' && submission.studentId !== userId) {
            return sendResponse(res, 403, 'error', 'You do not have permission to view this submission');
        } else if (userRole === 'teacher' && submission.assignment.teacherId !== userId) {
            return sendResponse(res, 403, 'error', 'You do not have permission to view this submission');
        }

        sendResponse(res, 200, 'success', 'Submission retrieved successfully', submission);
    } catch (error) {
        console.error('Get submission by ID error:', error);
        sendResponse(res, 500, 'error', 'Failed to retrieve submission');
    }
};

module.exports = {
    createOrUpdateSubmission,
    submitSubmission,
    gradeSubmission,
    getAssignmentSubmissions,
    getStudentSubmissions,
    getSubmissionById
};
