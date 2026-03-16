const axios = require('axios');

const BASE = 'https://api.hianime.bar/api';
const ID = '69b650a32c52b5fcc425029c';
const SLUG = 'summer-time-rendering-5hwlkp';

async function probe() {
    const paths = [
        `/v2/hianime/anime/${SLUG}/episodes`,
        `/v2/hianime/anime/${ID}/episodes`,
        `/hianime/anime/${SLUG}/episodes`,
        `/hianime/anime/${ID}/episodes`,
        `/v2/episode/list?id=${ID}`,
        `/v2/episodes?id=${ID}`,
        `/v2/anime/episodes/${ID}`
    ];

    for (const p of paths) {
        const url = BASE + p;
        try {
            console.log(`Checking: ${url}`);
            const res = await axios.get(url, { timeout: 10000 });
            let count = 0;
            if (res.data.data && res.data.data.episodes) count = res.data.data.episodes.length;
            else if (res.data.episodes) count = res.data.episodes.length;
            else if (Array.isArray(res.data)) count = res.data.length;

            if (count > 0) {
                console.log(`!!MATCH!! Count: ${count} | URL: ${url}`);
                if (count >= 24) process.exit(0);
            }
        } catch (e) {
            console.log(`FAIL: ${url} (${e.message})`);
        }
    }
}

probe();
