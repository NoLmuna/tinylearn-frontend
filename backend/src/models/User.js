/* eslint-disable no-undef */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'first_name',
            validate: {
                notEmpty: true,
                len: [2, 50]
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'last_name',
            validate: {
                notEmpty: true,
                len: [2, 50]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: 'user_email',
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'user_password',
            validate: {
                is: {
                    args: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/,
                    msg: 'Password must be at least 8 characters long and contain at least one capital letter and a number.'
                }
            }
        },
        role: {
            type: DataTypes.ENUM('student', 'teacher', 'parent', 'admin'),
            defaultValue: 'student',
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 120
            }
        },
        grade: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 20]
            }
        },
        parentEmail: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'parent_email',
            validate: {
                isEmail: true
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_active'
        },
        accountStatus: {
            type: DataTypes.ENUM('pending', 'approved', 'suspended'),
            defaultValue: 'approved',
            field: 'account_status'
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'created_by',
            references: {
                model: 'users',
                key: 'id'
            }
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'last_login'
        },
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'profile_picture'
        }
    }, {
        tableName: 'users',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['user_email']
            }
        ]
    });

    return User;
};