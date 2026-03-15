const axios = require('axios');

const BASE = "https://api.hianime.bar/api";
const slug = "summer-time-rendering-5hwlkp";

async function test() {
    try {
        const res = await axios.get(`${BASE}/anime/episodes?id=${slug}`);
        console.log("Episodes API Keys:", Object.keys(res.data));
        console.log("Sample Episode:", res.data.episodes ? res.data.episodes[0] : "N/A");
    } catch (err) {
        console.error("Episodes API FAILED:", err.message);
    }
}

test();
