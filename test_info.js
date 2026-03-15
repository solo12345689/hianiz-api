const axios = require('axios');

const BASE = "https://api.hianime.bar/api";
const slug = "summer-time-rendering-5hwlkp";

async function test() {
    try {
        const res = await axios.get(`${BASE}/anime/${slug}`);
        const ep = res.data.anime.episodes[0];
        // Extracting all slugs
        console.log("Episode Slugs:", ep.slugs);
        // Extracting IDs from links
        const subLinks = ep.link.sub;
        console.log("Sub Links:", subLinks);
    } catch (err) {
        console.error(err.message);
    }
}

test();
