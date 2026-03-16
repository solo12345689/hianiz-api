const axios = require('axios');

const BASE = 'https://api.hianime.bar/api';
const ID = '69b650a32c52b5fcc425029c';
const SLUG = 'summer-time-rendering-5hwlkp';

async function probe() {
    const variants = [
        `/anime/${ID}`,
        `/anime/${SLUG}`,
        `/episodes/${ID}`,
        `/episodes/${SLUG}`,
        `/episode/${ID}`,
        `/episode/${SLUG}`,
        `/anime/${ID}/episodes`,
        `/anime/${SLUG}/episodes`,
        `/anime/episodes/${ID}`,
        `/anime/episodes/${SLUG}`,
        `/anime/all/${ID}`,
        `/anime/all/${SLUG}`,
        `/v1/episodes?id=${ID}`,
        `/v2/episodes?id=${ID}`,
        `/episodes?anime_id=${ID}`,
        `/episodes?id=${ID}`,
        `/episodes?slug=${SLUG}`,
        `/ajax/episode/list?id=${ID}`,
        `/ajax/v2/episode/list?id=${ID}`,
        `/ajax/episodes?id=${ID}`,
        `/episodes/list/${ID}`
    ];

    const params = [
        '',
        '?limit=100',
        '?all=true',
        '?episodes=all',
        '?full=true'
    ];

    for (const v of variants) {
        for (const p of params) {
            const url = `${BASE}${v}${p}`;
            try {
                const res = await axios.get(url, { timeout: 2000 });
                const data = res.data;
                
                // Check for episode array
                let eps = [];
                if (Array.isArray(data)) eps = data;
                else if (data.episodes) eps = data.episodes;
                else if (data.anime && data.anime.episodes) eps = data.anime.episodes;
                else if (data.data && data.data.episodes) eps = data.data.episodes;

                if (eps && eps.length > 1) {
                    console.log(`✅ MATCH! URL: ${url} | Count: ${eps.length}`);
                    process.exit(0);
                } else if (eps && eps.length === 1) {
                    // console.log(`[1] ${url}`);
                }
            } catch (err) {
                // ignore
            }
        }
    }
    console.log("No multi-episode endpoint found.");
}

probe();
