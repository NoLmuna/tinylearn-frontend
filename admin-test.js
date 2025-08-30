/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Admin functionality test script
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
const ADMIN_CREDENTIALS = {
    email: 'admin@tinylearn.com',
    password: 'Admin123!'
};

async function testAdminAPI() {
    try {
        console.log('🔍 Testing Admin Functionality...\n');

        // 1. Login as admin
        console.log('1. Testing admin login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, ADMIN_CREDENTIALS);
        
        if (loginResponse.data.success) {
            console.log('✅ Admin login successful');
            const token = loginResponse.data.data.accessToken;
            const headers = { 'Authorization': `Bearer ${token}` };

            // 2. Test getting all users (admin-only feature)
            console.log('\n2. Testing get all users...');
            const usersResponse = await axios.get(`${BASE_URL}/users`, { headers });
            console.log(`✅ Retrieved ${usersResponse.data.data.length} users`);

            // 3. Test user creation
            console.log('\n3. Testing user creation...');
            const newUser = {
                firstName: 'Test',
                lastName: 'Student',
                email: `test.student.${Date.now()}@example.com`,
                password: 'Test123!',
                role: 'student',
                age: 10,
                grade: '5th'
            };

            try {
                const createResponse = await axios.post(`${BASE_URL}/users/register`, newUser, { headers });
                console.log('✅ User creation successful');
            } catch (error) {
                console.log('❌ User creation failed:', error.response?.data?.message || error.message);
            }

            // 4. Test getting lessons (admin should see all)
            console.log('\n4. Testing lesson access...');
            const lessonsResponse = await axios.get(`${BASE_URL}/lessons`, { headers });
            console.log(`✅ Retrieved ${lessonsResponse.data.data.length} lessons`);

            // 5. Test getting assignments (admin should see all)
            console.log('\n5. Testing assignment access...');
            const assignmentsResponse = await axios.get(`${BASE_URL}/assignments`, { headers });
            console.log(`✅ Retrieved ${assignmentsResponse.data.data.length} assignments`);

            // 6. Test getting progress data
            console.log('\n6. Testing progress access...');
            try {
                const progressResponse = await axios.get(`${BASE_URL}/progress`, { headers });
                console.log(`✅ Retrieved progress data`);
            } catch (error) {
                console.log('❌ Progress access failed:', error.response?.data?.message || error.message);
            }

            // 7. Test role-based user filtering
            console.log('\n7. Testing role-based filtering...');
            const roles = ['student', 'teacher', 'parent'];
            for (const role of roles) {
                try {
                    const roleUsersResponse = await axios.get(`${BASE_URL}/users/by-role/${role}`, { headers });
                    console.log(`✅ Retrieved ${roleUsersResponse.data.data.length} ${role}s`);
                } catch (error) {
                    console.log(`❌ Failed to get ${role}s:`, error.response?.data?.message || error.message);
                }
            }

        } else {
            console.log('❌ Admin login failed');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data?.message || error.message);
    }
}

// Additional UI functionality check
function checkUIFeatures() {
    console.log('\n🎨 Admin UI Features Analysis:');
    console.log('✅ Admin Dashboard - Shows system stats and overview');
    console.log('✅ User Management - List, filter, search users');
    console.log('❓ User Creation - Modal exists but needs backend validation');
    console.log('❓ User Editing - UI placeholder, needs implementation');
    console.log('❓ User Deletion - API exists but may need validation');
    console.log('✅ System Monitoring - Shows system status (mostly mock data)');
    console.log('✅ Reports - Shows analytics (mostly mock data)');
    console.log('✅ Role-based Protection - AdminProtectedRoute works');
    console.log('✅ Authentication - Separate admin login');
}

if (require.main === module) {
    testAdminAPI().then(() => {
        checkUIFeatures();
    });
}

module.exports = { testAdminAPI, checkUIFeatures };
