const fs = require('fs');
const path = require('path');

function getEnvToken() {
    try {
        const envPath = path.resolve(__dirname, '../.env.local');
        if (!fs.existsSync(envPath)) return null;
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/WEB3_CAREER_TOKEN=([^\s]+)/);
        return match ? match[1] : null;
    } catch (e) {
        return null;
    }
}

async function testApi() {
    const token = getEnvToken();
    const url = `https://web3.career/api/v1?token=${token}`;

    console.log(`Testing API with token: ${token ? token.substring(0, 4) + '...' : 'MISSING'}`);
    if (!token) return;

    try {
        console.log('Fetching...');
        const res = await fetch(url);
        console.log('Status:', res.status, res.statusText);

        if (res.ok) {
            const data = await res.json();
            console.log('Response type:', typeof data);
            console.log('Is Array?', Array.isArray(data));
            if (Array.isArray(data)) {
                console.log('Array length:', data.length);
                data.forEach((item, i) => {
                    console.log(`Index ${i} type:`, typeof item, Array.isArray(item) ? `Array[${item.length}]` : '');
                    if (Array.isArray(item) && item.length > 0) {
                        console.log(`  Index ${i} preview (item 0):`, JSON.stringify(item[0]).substring(0, 100));
                        console.log(`  Index ${i} item 0 keys:`, Object.keys(item[0]));
                        if (i === 2) {
                            const job = item[0];
                            console.log('Sample Job details:');
                            console.log(' - ID:', job.id);
                            console.log(' - Title:', job.title);
                            console.log(' - Company:', job.company);
                            console.log(' - Url:', job.url);
                            console.log(' - Tags:', job.tags);
                        }
                    } else if (typeof item === 'string') {
                        console.log(`  Index ${i} value:`, item);
                    }
                });
            }
        } else {
            const text = await res.text();
            console.log('Error body:', text);
        }
    } catch (e) {
        console.error('Fetch failed:', e.message);
    }
}

testApi();
