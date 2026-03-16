const axios = require('axios');
const fs = require('fs');

async function probe() {
    const baseURL = 'https://api.hianime.bar/api';
    
    try {
        console.log(`Probing ${baseURL}/home...`);
        const response = await axios.get(`${baseURL}/home`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        fs.writeFileSync('backend_home_full.json', JSON.stringify(response.data, null, 2));
        console.log('Result saved!');
    } catch (error) {
        console.error('Probe failed:', error.message);
    }
}

probe();
