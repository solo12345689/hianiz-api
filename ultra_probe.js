const axios = require('axios');
const fs = require('fs');

async function probe() {
    const bases = [
        'https://api.hianime.bar/api',
        'https://api.hianime.bar/api/v1',
        'https://api.hianime.bar/v1',
        'https://api.hianime.bar'
    ];
    const query = 'Summer';
    const paths = [
        '/search',
        '/anime/search',
        '/anime/list',
        '/animelist',
        '/search/suggestion',
        '/search/suggest'
    ];
    const params = [
        { q: query },
        { keyword: query },
        { title: query },
        { name: query }
    ];

    for (const base of bases) {
        for (const p of paths) {
            for (const pv of params) {
                try {
                    const url = `${base}${p}`;
                    console.log(`Probing GET ${url} with ${JSON.stringify(pv)}...`);
                    const res = await axios.get(url, { 
                        params: pv,
                        headers: { 
                            'User-Agent': 'Mozilla/5.0',
                            'Referer': 'https://hianimes.se/'
                        },
                        timeout: 5000
                    });
                    
                    const list = res.data.animes || res.data.results || res.data.data || [];
                    if (Array.isArray(list) && list.length > 0) {
                        const first = list[0].title || list[0].name || list[0].English || '';
                        const match = first.toLowerCase().includes(query.toLowerCase());
                        console.log(`  SUCCESS: Found ${list.length} items. Match? ${match}`);
                        if (match) {
                            console.log(`  !!! FOUND WORKING ENDPOINT: ${url} !!!`);
                            fs.writeFileSync('FOUND_SEARCH.json', JSON.stringify({ url, params: pv, data: res.data }, null, 2));
                            // process.exit(0);
                        }
                    } else {
                        console.log(`  Empty Success.`);
                    }
                } catch (e) {
                    // console.log(`  Failed: ${e.message}`);
                }
            }
        }
    }
}

probe();
