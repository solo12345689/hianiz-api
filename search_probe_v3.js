const axios = require('axios');
const fs = require('fs');

async function probe() {
    const baseURL = 'https://api.hianime.bar/api';
    const query = 'Summer';
    
    // List of probable search endpoints and fields
    const variants = [
        { url: '/anime/search-suggest', params: { q: query } },
        { url: '/search/suggest', params: { q: query } },
        { url: '/search/suggestion', params: { keyword: query } },
        { url: '/anime/search', params: { keyword: query } },
        { url: '/anime', params: { q: query } },
        { url: '/anime', params: { keyword: query } },
        { url: '/anime', params: { name: query } },
        { url: '/filter', method: 'POST', data: { name: query } },
        { url: '/filter', method: 'POST', data: { title: query } },
        { url: '/filter', method: 'POST', data: { q: query } },
        { url: '/filter', method: 'GET', params: { name: query } },
        { url: '/filter', method: 'GET', params: { title: query } }
    ];

    for (const v of variants) {
        try {
            const method = v.method || 'GET';
            console.log(`Probing ${method} ${baseURL}${v.url} with ${JSON.stringify(v.params || v.data)}...`);
            let res;
            if (method === 'GET') {
                res = await axios.get(`${baseURL}${v.url}`, { params: v.params, headers: { 'User-Agent': 'Mozilla/5.0' } });
            } else {
                res = await axios.post(`${baseURL}${v.url}`, v.data, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            }
            
            const results = res.data.results || res.data.animes || res.data.data || [];
            if (Array.isArray(results) && results.length > 0) {
                const match = results.some(a => (a.title || a.name || a.English || '').toLowerCase().includes(query.toLowerCase()));
                console.log(`  Success! Found ${results.length} items. Match? ${match}`);
                if (match) {
                    console.log(`  >>> FOUND WORKING SEARCH: ${v.url} with ${JSON.stringify(v.params || v.data)}`);
                    fs.writeFileSync(`probe_success_${v.url.replace(/\//g, '_')}_${method}.json`, JSON.stringify(res.data, null, 2));
                }
            } else {
                console.log(`  Success but empty results.`);
            }
        } catch (error) {
            console.log(`  Failed: ${error.message}`);
        }
    }
}

probe();
