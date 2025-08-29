/* eslint-disable no-undef */
const { User } = require('./src/models/database');

async function testDB() {
    try {
        const users = await User.findAll({ limit: 5 });
        console.log('✅ Database connection working!');
        console.log('Users found:', users.length);
        users.forEach(user => {
            console.log(`- ${user.firstName} ${user.lastName} (${user.role})`);
        });
        process.exit(0);
    } catch (error) {
        console.error('❌ Database error:', error);
        process.exit(1);
    }
}

testDB();
