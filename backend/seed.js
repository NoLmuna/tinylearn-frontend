/* eslint-disable no-undef */
require('dotenv').config();
const { User, Lesson, Assignment, StudentParent } = require('./src/models/database');
const argon2 = require('argon2');

/**
 * Database seeding script for TinyLearn
 */
const seedData = async () => {
    try {
        console.log('🌱 Starting to seed database...');

        // Create admin user
        console.log('👤 Creating admin user...');
        const adminPassword = await argon2.hash('Admin123!');
        const [admin] = await User.findOrCreate({
            where: { email: 'admin@tinylearn.com' },
            defaults: {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@tinylearn.com',
                password: adminPassword,
                role: 'admin',
                accountStatus: 'approved',
                createdBy: null
            }
        });

        // Create teacher user
        console.log('👩‍🏫 Creating teacher user...');
        const teacherPassword = await argon2.hash('Teacher123!');
        const [teacher] = await User.findOrCreate({
            where: { email: 'teacher@tinylearn.com' },
            defaults: {
                firstName: 'Sarah',
                lastName: 'Johnson',
                email: 'teacher@tinylearn.com',
                password: teacherPassword,
                role: 'teacher',
                accountStatus: 'approved',
                createdBy: admin.id
            }
        });

        // Create parent user
        console.log('👨‍👩‍👧 Creating parent user...');
        const parentPassword = await argon2.hash('Parent123!');
        const [parent] = await User.findOrCreate({
            where: { email: 'parent@tinylearn.com' },
            defaults: {
                firstName: 'Michael',
                lastName: 'Smith',
                email: 'parent@tinylearn.com',
                password: parentPassword,
                role: 'parent',
                accountStatus: 'approved',
                createdBy: admin.id
            }
        });

        // Create student user
        console.log('👶 Creating student user...');
        const studentPassword = await argon2.hash('Student123!');
        const [student] = await User.findOrCreate({
            where: { email: 'student@tinylearn.com' },
            defaults: {
                firstName: 'Emma',
                lastName: 'Smith',
                email: 'student@tinylearn.com',
                password: studentPassword,
                role: 'student',
                age: 6,
                grade: '1st Grade',
                parentEmail: 'parent@tinylearn.com',
                accountStatus: 'approved',
                createdBy: admin.id
            }
        });

        // Create parent-student relationship
        console.log('👪 Creating parent-student relationship...');
        await StudentParent.findOrCreate({
            where: { 
                studentId: student.id,
                parentId: parent.id 
            },
            defaults: {
                studentId: student.id,
                parentId: parent.id,
                relationship: 'parent',
                isActive: true
            }
        });

        // Create sample lessons
        console.log('📚 Creating sample lessons...');
        const sampleLessons = [
            {
                title: 'Learning Numbers 1-10',
                description: 'Introduction to counting and recognizing numbers from 1 to 10',
                content: 'In this lesson, children will learn to count from 1 to 10, recognize number symbols, and understand quantity.',
                category: 'math',
                difficulty: 'beginner',
                ageGroup: '3-5 years',
                duration: 15,
                createdBy: teacher.id,
                isActive: true
            },
            {
                title: 'Letter Recognition: A-Z',
                description: 'Learning to recognize and pronounce all letters of the alphabet',
                content: 'This lesson helps children identify uppercase and lowercase letters and associate them with sounds.',
                category: 'reading',
                difficulty: 'beginner',
                ageGroup: '4-6 years',
                duration: 20,
                createdBy: teacher.id,
                isActive: true
            },
            {
                title: 'Basic Shapes and Colors',
                description: 'Identifying common shapes and primary colors',
                content: 'Learn about circles, squares, triangles, and rectangles, along with red, blue, yellow, and green.',
                category: 'art',
                difficulty: 'beginner',
                ageGroup: '2-4 years',
                duration: 10,
                createdBy: teacher.id,
                isActive: true
            },
            {
                title: 'Simple Addition',
                description: 'Introduction to adding numbers 1-5',
                content: 'Using visual aids and manipulatives to understand the concept of addition.',
                category: 'math',
                difficulty: 'intermediate',
                ageGroup: '5-7 years',
                duration: 25,
                createdBy: teacher.id,
                isActive: true
            },
            {
                title: 'Animal Sounds and Names',
                description: 'Learning about different animals and the sounds they make',
                content: 'Explore farm animals, pets, and wild animals while learning their names and sounds.',
                category: 'science',
                difficulty: 'beginner',
                ageGroup: '2-5 years',
                duration: 15,
                createdBy: teacher.id,
                isActive: true
            }
        ];

        for (const lessonData of sampleLessons) {
            await Lesson.findOrCreate({
                where: { title: lessonData.title },
                defaults: lessonData
            });
        }

        // Create sample assignments
        console.log('📝 Creating sample assignments...');
        const lessons = await Lesson.findAll();
        const sampleAssignments = [
            {
                title: 'Numbers Practice Worksheet',
                description: 'Practice counting and writing numbers 1-10',
                instructions: 'Complete the worksheet by writing numbers and counting objects. Take your time and ask for help if needed.',
                teacherId: teacher.id,
                lessonId: lessons.find(l => l.title.includes('Numbers'))?.id || lessons[0].id,
                assignedTo: [student.id],
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                maxPoints: 100,
                assignmentType: 'worksheet',
                isActive: true
            },
            {
                title: 'Letter Recognition Exercise',
                description: 'Identify and trace uppercase and lowercase letters A-F',
                instructions: 'Look at each letter and trace it carefully. Say the letter name out loud as you trace.',
                teacherId: teacher.id,
                lessonId: lessons.find(l => l.title.includes('Letters'))?.id || lessons[1].id,
                assignedTo: [student.id],
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                maxPoints: 80,
                assignmentType: 'exercise',
                isActive: true
            },
            {
                title: 'Draw Your Family',
                description: 'Create a drawing of your family members',
                instructions: 'Draw a picture of your family. Include everyone who lives in your house. Use colors to make it bright and beautiful!',
                teacherId: teacher.id,
                lessonId: lessons.find(l => l.title.includes('Colors'))?.id || lessons[2].id,
                assignedTo: [student.id],
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                maxPoints: 100,
                assignmentType: 'project',
                isActive: true
            },
            {
                title: 'Animal Sounds Quiz',
                description: 'Match animals with the sounds they make',
                instructions: 'Listen to each sound and draw a line to the correct animal. You can ask a grown-up to help you listen.',
                teacherId: teacher.id,
                lessonId: lessons.find(l => l.title.includes('Animal'))?.id || lessons[3].id,
                assignedTo: [student.id],
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                maxPoints: 60,
                assignmentType: 'quiz',
                isActive: true
            }
        ];

        for (const assignmentData of sampleAssignments) {
            await Assignment.findOrCreate({
                where: { title: assignmentData.title },
                defaults: assignmentData
            });
        }

        console.log('\n✅ Database seeded successfully!');
        console.log('\n� Test Login Credentials:');
        console.log('�👤 Admin: admin@tinylearn.com / Admin123!');
        console.log('👩‍🏫 Teacher: teacher@tinylearn.com / Teacher123!');
        console.log('👨‍👩‍👧 Parent: parent@tinylearn.com / Parent123!');
        console.log('👶 Student: student@tinylearn.com / Student123!');
        console.log('\n🎯 Ready to start TinyLearn!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
};

// Export for programmatic use
module.exports = seedData;

// Run if called directly
if (require.main === module) {
    seedData()
        .then(() => {
            console.log('🎉 Seeding completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Seeding failed:', error);
            process.exit(1);
        });
}
