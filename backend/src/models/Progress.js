/* eslint-disable no-undef */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Progress = sequelize.define('Progress', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
            references: {
                model: 'users',
                key: 'id'
            }
        },
        lessonId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'lesson_id',
            references: {
                model: 'lessons',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
            defaultValue: 'not_started'
        },
        score: {
            type: DataTypes.FLOAT,
            allowNull: true,
            validate: {
                min: 0,
                max: 100
            }
        },
        timeSpent: {
            type: DataTypes.INTEGER, // in minutes
            allowNull: true,
            field: 'time_spent',
            defaultValue: 0
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'completed_at'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'progress',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'lesson_id']
            },
            {
                fields: ['user_id']
            },
            {
                fields: ['lesson_id']
            },
            {
                fields: ['status']
            }
        ]
    });

    return Progress;
};
