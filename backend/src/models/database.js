/* eslint-disable no-undef */
const dbconfig = require('../config/config');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(dbconfig.database, dbconfig.user, dbconfig.password, {
    host: dbconfig.host,
    dialect: dbconfig.dialect,
    logging: false // Disable SQL logging in production
});

sequelize.authenticate()
.then(() => console.log('✅ Database connected successfully!'))
.catch(err => console.log('❌ Database connection error:', err));

// Import model functions
const UserModel = require('./User');
const LessonModel = require('./Lesson');
const ProgressModel = require('./Progress');
const AssignmentModel = require('./Assignment');
const SubmissionModel = require('./Submission');
const MessageModel = require('./Message');
const StudentParentModel = require('./StudentParent');
const AchievementModel = require('./Achievement');

// Initialize models
const User = UserModel(sequelize);
const Lesson = LessonModel(sequelize);
const Progress = ProgressModel(sequelize);
const Assignment = AssignmentModel(sequelize);
const Submission = SubmissionModel(sequelize);
const Message = MessageModel(sequelize);
const StudentParent = StudentParentModel(sequelize);
const Achievement = AchievementModel(sequelize);

// Set up associations
// User and Lesson associations
User.hasMany(Lesson, {
    foreignKey: 'createdBy',
    as: 'lessons'
});

Lesson.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator'
});

// User and Progress associations
User.hasMany(Progress, {
    foreignKey: 'userId',
    as: 'progress'
});

Progress.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Lesson and Progress associations
Lesson.hasMany(Progress, {
    foreignKey: 'lessonId',
    as: 'progress'
});

Progress.belongsTo(Lesson, {
    foreignKey: 'lessonId',
    as: 'lesson'
});

// Assignment associations
User.hasMany(Assignment, {
    foreignKey: 'teacherId',
    as: 'createdAssignments'
});

Assignment.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher'
});

Lesson.hasMany(Assignment, {
    foreignKey: 'lessonId',
    as: 'assignments'
});

Assignment.belongsTo(Lesson, {
    foreignKey: 'lessonId',
    as: 'lesson'
});

// Submission associations
Assignment.hasMany(Submission, {
    foreignKey: 'assignmentId',
    as: 'submissions'
});

Submission.belongsTo(Assignment, {
    foreignKey: 'assignmentId',
    as: 'assignment'
});

User.hasMany(Submission, {
    foreignKey: 'studentId',
    as: 'submissions'
});

Submission.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student'
});

User.hasMany(Submission, {
    foreignKey: 'gradedBy',
    as: 'gradedSubmissions'
});

Submission.belongsTo(User, {
    foreignKey: 'gradedBy',
    as: 'grader'
});

// Message associations
User.hasMany(Message, {
    foreignKey: 'senderId',
    as: 'sentMessages'
});

Message.belongsTo(User, {
    foreignKey: 'senderId',
    as: 'sender'
});

User.hasMany(Message, {
    foreignKey: 'receiverId',
    as: 'receivedMessages'
});

Message.belongsTo(User, {
    foreignKey: 'receiverId',
    as: 'receiver'
});

User.hasMany(Message, {
    foreignKey: 'relatedStudentId',
    as: 'relatedMessages'
});

Message.belongsTo(User, {
    foreignKey: 'relatedStudentId',
    as: 'relatedStudent'
});

// Student-Parent associations
User.hasMany(StudentParent, {
    foreignKey: 'studentId',
    as: 'parentRelations'
});

StudentParent.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student'
});

User.hasMany(StudentParent, {
    foreignKey: 'parentId',
    as: 'childrenRelations'
});

StudentParent.belongsTo(User, {
    foreignKey: 'parentId',
    as: 'parent'
});

// Achievement associations
User.hasMany(Achievement, {
    foreignKey: 'userId',
    as: 'achievements'
});

Achievement.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Lesson.hasMany(Achievement, {
    foreignKey: 'relatedLessonId',
    as: 'achievements'
});

Achievement.belongsTo(Lesson, {
    foreignKey: 'relatedLessonId',
    as: 'relatedLesson'
});

Assignment.hasMany(Achievement, {
    foreignKey: 'relatedAssignmentId',
    as: 'achievements'
});

Achievement.belongsTo(Assignment, {
    foreignKey: 'relatedAssignmentId',
    as: 'relatedAssignment'
});

sequelize.sync({ force: false })
.then(() => console.log('✅ Database synced successfully!'))
.catch((error) => console.error('❌ Error during database sync:', error));

// Export models and sequelize instance
const db = {
    sequelize,
    User,
    Lesson,
    Progress,
    Assignment,
    Submission,
    Message,
    StudentParent,
    Achievement
};

module.exports = db;