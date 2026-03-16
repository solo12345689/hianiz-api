const axios = require('axios');
const fs = require('fs');

async function probe() {
    const baseURL = 'https://api.hianime.bar/api';
    const query = 'Summer';
    
    const endpoints = [
        { url: '/search', method: 'GET', params: { q: query } },
        { url: '/search', method: 'GET', params: { query: query } },
        { url: '/search', method: 'GET', params: { keyword: query } },
        { url: '/search', method: 'POST', data: { q: query } },
        { url: '/search', method: 'POST', data: { query: query } },
        { url: '/search/anime', method: 'GET', params: { q: query } },
        { url: '/search/suggestion', method: 'GET', params: { q: query } },
        { url: '/anime/search', method: 'GET', params: { q: query } },
        { url: '/anime/list', method: 'GET', params: { q: query } },
        { url: '/animelist', method: 'GET', params: { q: query } },
        { url: '/animelist', method: 'GET', params: { name: query } },
    ];

    for (const ep of endpoints) {
        try {
            console.log(`Probing ${ep.method} ${baseURL}${ep.url} with ${JSON.stringify(ep.params || ep.data)}...`);
            let res;
            if (ep.method === 'GET') {
                res = await axios.get(`${baseURL}${ep.url}`, { params: ep.params, headers: { 'User-Agent': 'Mozilla/5.0' } });
            } else {
                res = await axios.post(`${baseURL}${ep.url}`, ep.data, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            }
            
            const results = res.data.results || res.data.animes || res.data.data || [];
            console.log(`  Success! Found ${results.length} results. Total: ${res.data.total || 'N/A'}`);
            
            // Check if any result actually contains "Summer"
            const match = results.some(a => (a.title || a.name || a.English || '').toLowerCase().includes(query.toLowerCase()));
            console.log(`  Actually matches "Summer"? ${match}`);
            
            if (match) {
                fs.writeFileSync(`probe_match_${ep.url.replace(/\//g, '_')}_${ep.method}.json`, JSON.stringify(res.data, null, 2));
            }
        } catch (error) {
            console.log(`  Failed: ${error.message} ${error.response ? '(Status: ' + error.response.status + ')' : ''}`);
        }
    }
}

probe();
