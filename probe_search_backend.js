const axios = require('axios');
const fs = require('fs');

async function probe() {
    const baseURL = 'https://api.hianime.bar/api';
    const queries = ['/search?q=Summer', '/anime/search?q=Summer', '/filter?title=Summer', '/filter?name=Summer'];
    
    for (const q of queries) {
        try {
            console.log(`Probing ${baseURL}${q}...`);
            let response;
            if (q.startsWith('/filter')) {
                const key = q.includes('title') ? 'title' : 'name';
                response = await axios.post(`${baseURL}/filter`, { [key]: 'Summer' }, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            } else {
                response = await axios.get(`${baseURL}${q}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            }
            console.log(`Success ${q}: found ${response.data.results?.length || response.data.animes?.length || 0} items`);
            fs.writeFileSync(`probe_${q.replace(/[/?=]/g, '_')}.json`, JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log(`Failed ${q}: ${error.message}`);
        }
    }
}

probe();
