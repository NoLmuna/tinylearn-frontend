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

// Initialize models
const User = UserModel(sequelize);
const Lesson = LessonModel(sequelize);
const Progress = ProgressModel(sequelize);

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

sequelize.sync({ force: false })
.then(() => console.log('✅ Database synced successfully!'))
.catch((error) => console.error('❌ Error during database sync:', error));

// Export models and sequelize instance
const db = {
    sequelize,
    User,
    Lesson,
    Progress
};

module.exports = db;