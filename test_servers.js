const axios = require('axios');

const BASE = "https://api.hianime.bar/api";
const epId = "89776"; // taken from the sub link: https://megaplay.buzz/stream/s-2/89776/sub

async function test() {
    console.log(`🚀 Probing Episode Servers for ID: ${epId}...`);
    try {
        const res = await axios.get(`${BASE}/episode/servers?id=${epId}`);
        console.log("✅ SUCCESS /episode/servers?id=");
        console.log(res.data);
    } catch (err) {
        console.log(`❌ FAILED /episode/servers?id=: ${err.message}`);
    }

    try {
        const res2 = await axios.get(`${BASE}/episode/servers?episodeId=${epId}`);
        console.log("✅ SUCCESS /episode/servers?episodeId=");
        console.log(res2.data);
    } catch (err) {
        console.log(`❌ FAILED /episode/servers?episodeId=: ${err.message}`);
    }
}

test();
