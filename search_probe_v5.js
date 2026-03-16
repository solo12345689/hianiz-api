const axios = require('axios');

async function probe() {
    const baseURL = 'https://api.hianime.bar/api';
    const query = 'Summer';
    
    const paths = [
        `/search/${query}`,
        `/anime/search/${query}`,
        `/anime/suggest/${query}`,
        `/search-suggest/${query}`,
        `/search?q=${query}`,
        `/anime?q=${query}`,
        `/animelist/search?q=${query}`
    ];

    for (const p of paths) {
        try {
            console.log(`Probing GET ${baseURL}${p}...`);
            const res = await axios.get(`${baseURL}${p}`, { 
                headers: { 
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://hianimes.se/'
                } 
            });
            console.log(`  Success! Found ${res.data.animes?.length || res.data.results?.length || 0} items.`);
        } catch (e) {
            // console.log(`  Failed: ${e.message}`);
        }
    }
}

probe();
