const axios = require('axios');

const BASE = 'https://api.hianime.bar/api';
const ID = '69b650a32c52b5fcc425029c';
const SLUG = 'summer-time-rendering-5hwlkp';

const variants = [
    `/episodes/${ID}`,
    `/episodes/${SLUG}`,
    `/episode/list/${ID}`,
    `/episode/list/${SLUG}`,
    `/anime/${ID}/episodes`,
    `/anime/${SLUG}/episodes`,
    `/anime/episodes/${ID}`,
    `/anime/episodes/${SLUG}`,
    `/ajax/episodes/${ID}`,
    `/ajax/episodes/${SLUG}`,
    `/ajax/episode/list/${ID}`,
    `/ajax/episode/list/${SLUG}`,
    `/v1/episodes/${ID}`,
    `/v2/episodes/${ID}`,
    `/v1/episodes?id=${ID}`,
    `/v2/episodes?id=${ID}`,
    `/episodes?anime_id=${ID}`,
    `/episodes?animeId=${ID}`,
    `/episodes?id=${ID}`,
    `/getepisodes?id=${ID}`,
    `/get-episodes/${ID}`,
    `/anime/${ID}/all`,
    `/anime/${SLUG}/all`
];

async function probe() {
    console.log("Probing for the 'one open endpoint' that returns 25 episodes...");
    for (const v of variants) {
        const url = BASE + v;
        try {
            const res = await axios.get(url, { timeout: 3000 });
            const data = res.data;
            let count = 0;
            if (Array.isArray(data)) count = data.length;
            else if (data.episodes) count = data.episodes.length;
            else if (data.data && data.data.episodes) count = data.data.episodes.length;
            else if (data.results) count = data.results.length;

            if (count > 0) {
                console.log(`✅ [${count}] ${url}`);
                if (count >= 24) {
                    console.log("🎯 FOUND IT!");
                    // process.exit(0);
                }
            }
        } catch (e) {
            // console.log(`❌ ${url} - ${e.message}`);
        }
    }
    console.log("Probe finished.");
}

probe();
