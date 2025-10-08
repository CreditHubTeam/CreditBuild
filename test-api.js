#!/usr/bin/env node

const API_BASE = 'http://localhost:3000/api';
const TEST_WALLET = '0x1111111111111111111111111111111111111111';

// Helper function to make HTTP requests
const request = async (method, url, body = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { error: 'Invalid JSON', response: text };
        }

        return {
            status: response.status,
            ok: response.ok,
            data
        };
    } catch (error) {
        return {
            status: 0,
            ok: false,
            data: { error: error.message }
        };
    }
};

// Test functions
const tests = {
    // 1. Test Challenges API
    async testGetAllChallenges() {
        console.log('\n🎯 Testing GET /challenges');
        const result = await request('GET', `${API_BASE}/challenges`);
        console.log(`Status: ${result.status}, OK: ${result.ok}`);

        if (result.ok && Array.isArray(result.data)) {
            console.log(`✅ Found ${result.data.length} challenges`);
            result.data.slice(0, 2).forEach(challenge => {
                console.log(`  - ${challenge.name} (${challenge.points} points, ${challenge.category})`);
            });
            return true;
        } else {
            console.log('❌ Failed:', result.data);
            return false;
        }
    },

    // 2. Test Daily Challenges API
    async testGetDailyChallenges() {
        console.log('\n📅 Testing GET /challenges/daily');
        const result = await request('GET', `${API_BASE}/challenges/daily?walletAddress=${TEST_WALLET}`);
        console.log(`Status: ${result.status}, OK: ${result.ok}`);

        if (result.ok && result.data.challenges) {
            console.log(`✅ Found ${result.data.challenges.length} daily challenges`);
            result.data.challenges.forEach(challenge => {
                console.log(`  - ${challenge.name} (completed: ${challenge.completedToday || false})`);
            });
            return true;
        } else {
            console.log('❌ Failed:', result.data);
            return false;
        }
    },

    // 3. Test User API
    async testGetUser() {
        console.log('\n👤 Testing GET /users/{walletAddress}');
        const result = await request('GET', `${API_BASE}/users/${TEST_WALLET}`);
        console.log(`Status: ${result.status}, OK: ${result.ok}`);

        if (result.ok && result.data.user) {
            const user = result.data.user;
            console.log(`✅ User found: ${user.username || 'No username'}`);
            console.log(`  - Credit Score: ${user.creditScore}`);
            console.log(`  - Streak Days: ${user.streakDays}`);
            console.log(`  - Total Points: ${user.totalPoints}`);
            return true;
        } else {
            console.log('❌ Failed:', result.data);
            return false;
        }
    },

    // 4. Test Education API
    async testGetEducation() {
        console.log('\n📚 Testing GET /education');
        const result = await request('GET', `${API_BASE}/education`);
        console.log(`Status: ${result.status}, OK: ${result.ok}`);

        if (result.ok && result.data.content) {
            console.log(`✅ Found ${result.data.content.length} education items`);
            result.data.content.slice(0, 2).forEach(item => {
                console.log(`  - ${item.title} (${item.points} points, ${item.duration}min)`);
            });
            return true;
        } else {
            console.log('❌ Failed:', result.data);
            return false;
        }
    },

    // 5. Test Education Completion
    async testCompleteEducation() {
        console.log('\n🎓 Testing POST /education/complete');
        const result = await request('POST', `${API_BASE}/education/complete`, {
            walletAddress: TEST_WALLET,
            educationId: 1
        });
        console.log(`Status: ${result.status}, OK: ${result.ok}`);

        if (result.ok) {
            console.log(`✅ Education completion result:`, result.data);
            return true;
        } else {
            console.log('❌ Failed:', result.data);
            return false;
        }
    },

    // 6. Test Achievements API
    async testGetAchievements() {
        console.log('\n🏆 Testing GET /achievements');
        const result = await request('GET', `${API_BASE}/achievements`);
        console.log(`Status: ${result.status}, OK: ${result.ok}`);

        if (result.ok && result.data.achievements && Array.isArray(result.data.achievements)) {
            console.log(`✅ Found ${result.data.achievements.length} achievements`);
            result.data.achievements.slice(0, 2).forEach(achievement => {
                console.log(`  - ${achievement.name} (${achievement.points} points)`);
            });
            return true;
        } else {
            console.log('❌ Failed:', result.data);
            return false;
        }
    },

    // 7. Test Claims API (Challenge Completion)
    async testClaimChallenge() {
        console.log('\n💰 Testing POST /claims');
        const result = await request('POST', `${API_BASE}/claims`, {
            userAddress: TEST_WALLET,
            challengeId: 1,
            proof: {}
        });
        console.log(`Status: ${result.status}, OK: ${result.ok}`);

        if (result.ok) {
            console.log(`✅ Claim result:`, result.data);
            return true;
        } else {
            console.log('❌ Failed:', result.data);
            return false;
        }
    }
};

// Main execution
async function runTests() {
    console.log('🚀 Starting API Tests for Daily Challenge System');
    console.log(`Testing against: ${API_BASE}`);
    console.log(`Test wallet: ${TEST_WALLET}`);

    const results = [];

    // Run all tests
    for (const [testName, testFunc] of Object.entries(tests)) {
        try {
            const success = await testFunc();
            results.push({ test: testName, success });
        } catch (error) {
            console.log(`❌ ${testName} threw error:`, error.message);
            results.push({ test: testName, success: false, error: error.message });
        }
    }

    // Summary
    console.log('\n📊 Test Summary:');
    const passed = results.filter(r => r.success).length;
    const total = results.length;

    results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${result.test}`);
        if (result.error) console.log(`   Error: ${result.error}`);
    });

    console.log(`\n🎯 Results: ${passed}/${total} tests passed`);

    if (passed === total) {
        console.log('🎉 All tests passed! API is working correctly.');
    } else {
        console.log('⚠️  Some tests failed. Check API implementation.');
    }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
    console.log('❌ This script requires Node.js 18+ with fetch support');
    process.exit(1);
}

runTests().catch(console.error);