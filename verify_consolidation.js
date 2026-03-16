const axios = require('axios');

const BASE = 'https://api.hianime.bar/api';
const ID = '69b650a32c52b5fcc425029c';
const TITLE = 'Summer Time Rendering';

async function testConsolidation() {
    try {
        console.log("Fetching primary record...");
        const mainRes = await axios.get(`${BASE}/anime/summer-time-rendering-5hwlkp`);
        const doc = mainRes.data.anime;
        const mainEps = doc.episodes || [];
        console.log(`Primary record episodes: ${mainEps.length}`);

        console.log("Searching for scattered episodes...");
        const [latestRes, listRes] = await Promise.all([
            axios.get(`${BASE}/latest/anime?limit=1000`),
            axios.get(`${BASE}/animelist?title=${encodeURIComponent(TITLE)}&limit=100`)
        ]);

        const allFound = [...latestRes.data.animes, ...listRes.data.animes];
        const consolidated = [...mainEps];

        allFound.forEach(m => {
            if (m.title && m.title.includes(TITLE) && m.episodes && m.episodes[0]) {
                const ep = m.episodes[0];
                if (!consolidated.find(e => e.episodeNumber === ep.episodeNumber)) {
                    consolidated.push(ep);
                }
            }
        });

        console.log(`✅ CONSOLIDATED TOTAL: ${consolidated.length}`);
        consolidated.sort((a,b) => a.episodeNumber - b.episodeNumber).slice(0, 5).forEach(e => {
            console.log(`- Ep ${e.episodeNumber}: ${e.title}`);
        });

    } catch (err) {
        console.log("Test failed:", err.message);
    }
}

testConsolidation();
