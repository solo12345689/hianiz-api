const axios = require('axios');

const BASE = 'https://api.hianime.bar/api';
const ID = '69b650a32c52b5fcc425029c';
const SLUG = 'summer-time-rendering-5hwlkp';

async function probe() {
    const paths = [
        `/episodes/${ID}`,
        `/anime/${ID}/episodes`,
        `/anime/episodes/${ID}`,
        `/v1/episodes/${ID}`,
        `/v2/episodes/${ID}`,
        `/episodes?id=${ID}`,
        `/episodes?animeId=${ID}`,
        `/episodes?anime_id=${ID}`,
        `/get-episodes?id=${ID}`,
        `/ajax/episodes/${ID}`,
        `/anime/all/${ID}`,
        `/anime/${ID}/all`
    ];

    for (const p of paths) {
        try {
            const url = BASE + p;
            const res = await axios.get(url, { timeout: 3000 });
            if (res.data && (Array.isArray(res.data) && res.data.length > 1)) {
                console.log(`✅ FOUND ARRAY! ${url} | Count: ${res.data.length}`);
            } else if (res.data.episodes && res.data.episodes.length > 1) {
                console.log(`✅ FOUND OBJ.EPS! ${url} | Count: ${res.data.episodes.length}`);
            } else if (res.data.data && res.data.data.episodes && res.data.data.episodes.length > 1) {
                console.log(`✅ FOUND DATA.EPS! ${url} | Count: ${res.data.data.episodes.length}`);
            }
        } catch (e) {}
    }
}

probe();
