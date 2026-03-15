const axios = require('axios');

const BASE = "https://api.hianime.bar/api";
const routes = [
    'home', 
    'latest/anime', 
    'anime/upcoming', 
    'top-airing', 
    'filter',
    'search', 
    'schedule', 
    'anime/info', 
    'anime/episodes', 
    'episode/servers',
    'episode/sources', 
    'genre/list', 
    'producer/list', 
    'az-list',
    'animelist'
];

async function probe() {
    console.log(`🚀 Probing ${BASE}...\n`);
    for (const route of routes) {
        try {
            const res = await axios.get(`${BASE}/${route}`, { timeout: 5000 });
            console.log(`✅ FOUND: /${route} (Status: ${res.status})`);
            // console.log(JSON.stringify(res.data).slice(0, 100));
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    // console.log(`❌ NOT FOUND: /${route}`);
                } else {
                    console.log(`⚠️  PARTIAL: /${route} (Status: ${err.response.status} - Likely requires params)`);
                }
            } else {
                console.log(`🚫 ERROR: /${route} (${err.message})`);
            }
        }
    }
}

probe();
