const axios = require('axios');
const BASE = "https://api.hianime.bar/api";
const id = "69b650a32c52b5fcc425029c"; // STR

const paths = [
  `/episodes/${id}`,
  `/anime/${id}/episodes`,
  `/anime/episodes/${id}`,
  `/episode-list/${id}`,
  `/anime/${id}/all-episodes`,
  `/get-episodes?id=${id}`,
  `/ajax/episodes/${id}`,
  `/v1/anime/${id}/episodes`,
  `/v2/anime/${id}/episodes`,
  `/hianime/anime/${id}/episodes`,
  `/api/v2/hianime/anime/${id}/episodes`, // nested?
];

async function probe() {
    for (const p of paths) {
        try {
            const url = BASE + p;
            const res = await axios.get(url);
            console.log(`✅ FOUND: ${url}`);
            console.log(res.data);
        } catch (e) {
            // console.log(`FAIL: ${p}`);
        }
    }
}
probe();
