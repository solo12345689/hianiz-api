const axios = require('axios');

async function probe() {
    const baseURL = 'https://api.hianime.bar';
    const query = 'Summer';
    
    // Attempting endpoints at ROOT level (no /api prefix)
    const variants = [
        { url: '/search', params: { keyword: query } },
        { url: '/search', params: { q: query } },
        { url: '/search/suggestion', params: { keyword: query } },
        { url: '/search/suggestion', params: { q: query } },
        { url: '/anime/search', params: { q: query } },
        { url: '/anime/search', params: { keyword: query } },
        { url: '/api/v1/search', params: { keyword: query } },
        { url: '/api/v1/search/suggestion', params: { keyword: query } },
    ];

    for (const v of variants) {
        try {
            console.log(`Probing GET ${baseURL}${v.url} with ${JSON.stringify(v.params)}...`);
            const res = await axios.get(`${baseURL}${v.url}`, { 
                params: v.params, 
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                    'Referer': 'https://hianimes.se/'
                } 
            });
            
            const results = res.data.results || res.data.animes || res.data.suggestions || res.data.data || [];
            console.log(`  Success! Found ${results.length} items.`);
            if (Array.isArray(results) && results.length > 0) {
                const names = results.map(a => a.name || a.title || a.English || '').join(', ');
                console.log(`  Results: ${names.substring(0, 100)}...`);
            }
        } catch (error) {
            console.log(`  Failed: ${error.message}${error.response ? ' (Status: ' + error.response.status + ')' : ''}`);
        }
    }
}

probe();
