/* eslint-disable no-undef */
// Test script to check current login status and API responses
const fetch = require('node-fetch');

// First, let's login as the parent
async function testParentAPI() {
    try {
        console.log('=== LOGGING IN AS PARENT ===');
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'parent@tinylearn.com',
                password: 'Parent123!'
            })
        });
        
        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);
        
        if (!loginData.success || !loginData.data.token) {
            console.error('Failed to login');
            return;
        }
        
        const token = loginData.data.token;
        console.log('User logged in:', loginData.data.user);
        
        console.log('\n=== TESTING PARENT CHILDREN API ===');
        const childrenResponse = await fetch('http://localhost:3000/api/users/parent/children', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const childrenData = await childrenResponse.json();
        console.log('Children API response:', JSON.stringify(childrenData, null, 2));
        
    } catch (error) {
        console.error('Test error:', error);
    }
}

testParentAPI();
