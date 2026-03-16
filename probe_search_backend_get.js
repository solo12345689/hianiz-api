const axios = require('axios');
const fs = require('fs');

async function probe() {
    const baseURL = 'https://api.hianime.bar/api';
    const paths = [
        '/anime/search?q=Summer',
        '/search/anime?q=Summer',
        '/anime/list?q=Summer',
        '/anime/filter?q=Summer',
        '/search?keyword=Summer',
        '/search?title=Summer',
        '/anime?title=Summer'
    ];
    
    for (const p of paths) {
        try {
            console.log(`Probing ${baseURL}${p}...`);
            const response = await axios.get(`${baseURL}${p}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            console.log(`Success ${p}: found ${response.data.results?.length || response.data.animes?.length || 0} items`);
            fs.writeFileSync(`probe_get_${p.replace(/[/?=&]/g, '_')}.json`, JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log(`Failed ${p}: ${error.message}`);
        }
    }
}

probe();
