const axios = require('axios');

const BASE = 'https://api.hianime.bar/api';
const ID = '69b650a32c52b5fcc425029c';
const SLUG = 'summer-time-rendering-5hwlkp';

async function probe() {
    const segments = [
        'episodes', 'episode', 'getepisodes', 'get-episodes', 'all-episodes', 'list', 'episode-list'
    ];
    
    for (const seg of segments) {
        const tests = [
            `/${seg}/${ID}`,
            `/${seg}/${SLUG}`,
            `/anime/${ID}/${seg}`,
            `/anime/${SLUG}/${seg}`,
            `/anime/${seg}/${ID}`,
            `/anime/${seg}/${SLUG}`,
            `/${seg}?id=${ID}`,
            `/${seg}?anime_id=${ID}`,
            `/${seg}?id=${SLUG}`
        ];
        
        for (const t of tests) {
            const url = BASE + t;
            try {
                const res = await axios.get(url, { timeout: 3000 });
                const count = res.data.episodes ? res.data.episodes.length : (Array.isArray(res.data) ? res.data.length : 0);
                if (count > 0) {
                    console.log(`FOUND_Path_${t}_Count_${count}`);
                }
            } catch (e) {}
        }
    }
}

probe();
