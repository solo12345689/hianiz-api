const axios = require('axios');

const BASE = 'https://api.hianime.bar/api';
const ID = '69b650a32c52b5fcc425029c';
const SLUG = 'summer-time-rendering-5hwlkp';

const variants = [
    `/episodes/${ID}`,
    `/episodes/${SLUG}`,
    `/anime/${ID}/episodes`,
    `/anime/${SLUG}/episodes`,
    `/anime/episodes/${ID}`,
    `/anime/episodes/${SLUG}`,
    `/v2/episodes?id=${ID}`,
    `/v2/anime/${ID}/episodes`,
    `/v2/hianime/anime/${ID}/episodes`,
    `/v2/hianime/anime/${SLUG}/episodes`,
    `/episodes?anime_id=${ID}`,
    `/episodes?id=${ID}`,
    `/episodes?slug=${SLUG}`,
    `/getepisodes?id=${ID}`,
    `/getepisodes?slug=${SLUG}`,
    `/get-episodes/${ID}`,
    `/get-episodes/${SLUG}`,
    `/episode/list/${ID}`,
    `/episode/list/${SLUG}`,
    `/ajax/episodes/${ID}`,
    `/ajax/v2/episodes/${ID}`
];

async function probe() {
    console.log("Searching for 25-episode endpoint...");
    for (const v of variants) {
        const url = BASE + v;
        try {
            const res = await axios.get(url, { timeout: 3000 });
            const data = res.data;
            let eps = [];
            if (Array.isArray(data)) eps = data;
            else if (data.episodes) eps = data.episodes;
            else if (data.data && data.data.episodes) eps = data.data.episodes;
            else if (data.results) eps = data.results;

            if (eps && eps.length > 1) {
                console.log(`MATCH_FOUND: ${url} (Count: ${eps.length})`);
                if (eps.length >= 24) {
                    console.log("🎯 TARGET REACHED!");
                }
            } else if (eps && eps.length === 1) {
                // console.log(`[1] ${url}`);
            }
        } catch (e) {}
    }
    console.log("Probe finished.");
}

probe();
