/* eslint-disable no-undef */
const sequelize = require('./database');
const User = require('./User');
const Lesson = require('./Lesson');
const Progress = require('./Progress');

// Set up associations
User.hasMany(Lesson, {
    foreignKey: 'createdBy',
    as: 'lessons'
});

Lesson.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator'
});

User.hasMany(Progress, {
    foreignKey: 'userId',
    as: 'progress'
});

Progress.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Lesson.hasMany(Progress, {
    foreignKey: 'lessonId',
    as: 'progress'
});

Progress.belongsTo(Lesson, {
    foreignKey: 'lessonId',
    as: 'lesson'
});

module.exports = {
    sequelize,
    User,
    Lesson,
    Progress
};
