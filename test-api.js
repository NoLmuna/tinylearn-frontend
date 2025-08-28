/**
 * Quick API Testing Script for TinyLearn
 * Run this to verify all API endpoints are working
 */

const API_BASE = 'http://localhost:3000/api';

// Test credentials
const testUsers = {
  admin: { email: 'admin@tinylearn.com', password: 'Admin123!' },
  teacher: { email: 'teacher@tinylearn.com', password: 'Teacher123!' },
  parent: { email: 'parent@tinylearn.com', password: 'Parent123!' },
  student: { email: 'student@tinylearn.com', password: 'Student123!' }
};

// Test functions
async function testLogin(role, credentials) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${role.toUpperCase()} login successful`);
      console.log(`   Token: ${data.token.substring(0, 20)}...`);
      console.log(`   User: ${data.user.firstName} ${data.user.lastName}`);
      console.log(`   Role: ${data.user.role}`);
      return data.token;
    } else {
      console.log(`❌ ${role.toUpperCase()} login failed: ${data.message}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ ${role.toUpperCase()} login error: ${error.message}`);
    return null;
  }
}

async function testAuthenticatedEndpoint(token, role) {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${role.toUpperCase()} authenticated endpoint working`);
      return true;
    } else {
      console.log(`❌ ${role.toUpperCase()} authenticated endpoint failed: ${data.message}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${role.toUpperCase()} authenticated endpoint error: ${error.message}`);
    return false;
  }
}

async function testHealthCheck() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Health check passed');
      console.log(`   Status: ${data.status}`);
      console.log(`   Database: ${data.database ? 'Connected' : 'Disconnected'}`);
      return true;
    } else {
      console.log('❌ Health check failed');
      return false;
    }
  } catch (error) {
    console.log(`❌ Health check error: ${error.message}`);
    return false;
  }
}

// Main testing function
async function runAllTests() {
  console.log('🧪 Starting TinyLearn API Tests...\n');
  
  // Test health check
  console.log('📋 Testing Health Check...');
  await testHealthCheck();
  console.log('');
  
  // Test all user logins
  console.log('🔐 Testing User Authentication...');
  const tokens = {};
  
  for (const [role, credentials] of Object.entries(testUsers)) {
    const token = await testLogin(role, credentials);
    if (token) {
      tokens[role] = token;
    }
    console.log('');
  }
  
  // Test authenticated endpoints
  console.log('🔒 Testing Authenticated Endpoints...');
  for (const [role, token] of Object.entries(tokens)) {
    await testAuthenticatedEndpoint(token, role);
  }
  
  console.log('\n🎯 Testing completed!');
  console.log('\n📝 Test Summary:');
  console.log(`   Total users tested: ${Object.keys(testUsers).length}`);
  console.log(`   Successful logins: ${Object.keys(tokens).length}`);
  console.log(`   Success rate: ${(Object.keys(tokens).length / Object.keys(testUsers).length * 100).toFixed(1)}%`);
}

// Export for use in browser console or Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, testLogin, testHealthCheck };
} else {
  // Browser environment - expose to global scope
  window.TinyLearnAPITest = { runAllTests, testLogin, testHealthCheck };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🚀 TinyLearn API Testing Script Loaded!');
  console.log('📞 Run: TinyLearnAPITest.runAllTests() to start testing');
  console.log('🔗 Or copy this script to browser console on http://localhost:5173');
}
