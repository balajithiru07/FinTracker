const axios = require('axios');

async function testSettings() {
    try {
        console.log('Testing GET /api/expenses/settings...');
        const res = await axios.get('http://localhost:5000/api/expenses/settings');
        console.log('Success! Status:', res.status);
        console.log('Data:', res.data);
    } catch (err) {
        console.error('Failed:', err.message);
        if (err.response) {
            console.error('Response data:', err.response.data);
        }
    }
}

testSettings();
