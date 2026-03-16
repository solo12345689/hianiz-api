const axios = require('axios');

async function checkV2() {
    try {
        const url = 'https://api.hianime.bar/api/v2/hianime/anime/summer-time-rendering-5hwlkp/episodes';
        console.log(`Checking ${url}... (this might take a while)`);
        const res = await axios.get(url, { timeout: 40000 });
        const episodes = res.data.data.episodes || [];
        console.log(`✅ FOUND! Total Episodes: ${episodes.length}`);
        
        episodes.slice(0, 5).forEach(ep => {
            console.log(`- Ep ${ep.number}: ${ep.title} [${ep.episodeId}]`);
        });

    } catch (err) {
        console.log("Fail:", err.message);
    }
}

checkV2();
