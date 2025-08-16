/* eslint-disable no-undef, no-unused-vars */
require('dotenv').config();
const { User, Lesson } = require('./src/models/database');
const argon2 = require('argon2');

const seedData = async () => {
    try {
        console.log('🌱 Starting to seed database...');

        // Create admin user
        const adminPassword = await argon2.hash('Admin123!');
        await User.findOrCreate({
            where: { email: 'admin@tinylearn.com' },
            defaults: {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@tinylearn.com',
                password: adminPassword,
                role: 'admin'
            }
        });

        // Create teacher user
        const teacherPassword = await argon2.hash('Teacher123!');
        const teacher = await User.findOrCreate({
            where: { email: 'teacher@tinylearn.com' },
            defaults: {
                firstName: 'Sarah',
                lastName: 'Johnson',
                email: 'teacher@tinylearn.com',
                password: teacherPassword,
                role: 'teacher'
            }
        });

        // Create student user
        const studentPassword = await argon2.hash('Student123!');
        await User.findOrCreate({
            where: { email: 'student@tinylearn.com' },
            defaults: {
                firstName: 'Emma',
                lastName: 'Smith',
                email: 'student@tinylearn.com',
                password: studentPassword,
                role: 'student',
                age: 6,
                grade: '1st Grade',
                parentEmail: 'parent@example.com'
            }
        });

        // Create sample lessons
        const sampleLessons = [
            {
                title: 'Learning Numbers 1-10',
                description: 'Introduction to counting and recognizing numbers from 1 to 10',
                content: 'In this lesson, children will learn to count from 1 to 10, recognize number symbols, and understand quantity.',
                category: 'math',
                difficulty: 'beginner',
                ageGroup: '3-5 years',
                duration: 15,
                createdBy: teacher[0].id
            },
            {
                title: 'Letter Recognition: A-Z',
                description: 'Learning to recognize and pronounce all letters of the alphabet',
                content: 'This lesson helps children identify uppercase and lowercase letters and associate them with sounds.',
                category: 'reading',
                difficulty: 'beginner',
                ageGroup: '4-6 years',
                duration: 20,
                createdBy: teacher[0].id
            },
            {
                title: 'Basic Shapes and Colors',
                description: 'Identifying common shapes and primary colors',
                content: 'Learn about circles, squares, triangles, and rectangles, along with red, blue, yellow, and green.',
                category: 'art',
                difficulty: 'beginner',
                ageGroup: '2-4 years',
                duration: 10,
                createdBy: teacher[0].id
            },
            {
                title: 'Simple Addition',
                description: 'Introduction to adding numbers 1-5',
                content: 'Using visual aids and manipulatives to understand the concept of addition.',
                category: 'math',
                difficulty: 'intermediate',
                ageGroup: '5-7 years',
                duration: 25,
                createdBy: teacher[0].id
            },
            {
                title: 'Animal Sounds and Names',
                description: 'Learning about different animals and the sounds they make',
                content: 'Explore farm animals, pets, and wild animals while learning their names and sounds.',
                category: 'science',
                difficulty: 'beginner',
                ageGroup: '2-5 years',
                duration: 15,
                createdBy: teacher[0].id
            }
        ];

        for (const lessonData of sampleLessons) {
            await Lesson.findOrCreate({
                where: { title: lessonData.title },
                defaults: lessonData
            });
        }

        console.log('✅ Database seeded successfully!');
        console.log('👤 Admin user: admin@tinylearn.com / Admin123!');
        console.log('👩‍🏫 Teacher user: teacher@tinylearn.com / Teacher123!');
        console.log('👶 Student user: student@tinylearn.com / Student123!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        process.exit();
    }
};

seedData();
