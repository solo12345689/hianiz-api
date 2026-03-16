const axios = require('axios');
const fs = require('fs');

async function probe() {
    const baseURL = 'https://api.hianime.bar/api';
    
    try {
        console.log(`Probing ${baseURL}/filter with title "Summer"...`);
        const response = await axios.post(`${baseURL}/filter`, {
            title: 'Summer'
        }, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        fs.writeFileSync('filter_sum_probe.json', JSON.stringify(response.data, null, 2));
        console.log('Result saved!');
    } catch (error) {
        console.error('Probe failed:', error.message);
    }
}

probe();
