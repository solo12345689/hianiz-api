const axios = require('axios');
const slugs = [
    "summer-time-rendering-5hwlkp",
    "summer-time-rendering-mvjxzw",
    "summer-time-rendering-nwki3j",
    "summer-time-rendering-125lr7"
];

async function probe() {
    for (const s of slugs) {
        try {
            const res = await axios.get(`https://api.hianime.bar/api/anime/${s}`);
            const eps = res.data.anime.episodes;
            console.log(`Slug: ${s} | First Ep Number: ${eps[0].episodeNumber} | Eps Array Len: ${eps.length}`);
        } catch (e) {}
    }
}
probe();
