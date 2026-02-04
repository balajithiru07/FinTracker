async function testApi() {
    const urls = [
        'http://127.0.0.1:5000/api/expenses',
        'http://localhost:5000/api/expenses',
        'http://[::1]:5000/api/expenses'
    ];

    for (const url of urls) {
        try {
            console.log(`Testing ${url}...`);
            const res = await fetch(url);
            console.log(`✅ Success on ${url}`);
            const data = await res.json();
            console.log('Data:', data);
            return; // Exit on first success
        } catch (err) {
            console.error(`❌ Failed on ${url}: ${err.message}`);
        }
    }
    console.error('All connection attempts failed.');
}

testApi();
