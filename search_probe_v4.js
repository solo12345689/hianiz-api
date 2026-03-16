const axios = require('axios');
const fs = require('fs');

const axiosInstance = axios.create({
    baseURL: 'https://api.hianime.bar/api',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Referer': 'https://hianimes.se/',
        'Accept': 'application/json, text/plain, */*'
    }
});

async function probe() {
    const query = 'Summer';
    const paths = [
        '/search/anime',
        '/anime/search',
        '/search/suggestion',
        '/search/suggest',
        '/animelist/search',
        '/anime/list',
        '/anime/qtip',
    ];
    
    const params_variants = [
        { keyword: query },
        { q: query },
        { query: query },
        { title: query },
        { name: query }
    ];

    for (const p of paths) {
        for (const pv of params_variants) {
            try {
                console.log(`Probing GET ${p} with ${JSON.stringify(pv)}...`);
                const res = await axiosInstance.get(p, { params: pv });
                const results = res.data.animes || res.data.results || res.data.data || [];
                if (Array.isArray(results) && results.length > 0) {
                    const match = results.some(a => (a.title || a.name || a.English || '').toLowerCase().includes(query.toLowerCase()));
                    console.log(`  Found ${results.length}. Match? ${match}`);
                    if (match) {
                        console.log(`  [!SUCCESS!] ${p} ${JSON.stringify(pv)} matches!`);
                        process.exit(0);
                    }
                } else {
                    console.log(`  Empty results.`);
                }
            } catch (e) {
                // console.log(`  Failed: ${e.message}`);
            }
        }
    }
    console.log("No working search found among variants.");
}

probe();
