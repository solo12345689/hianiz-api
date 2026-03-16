const axios = require('axios');

async function checkFilter() {
    try {
        const query = 'Summer Time Rendering';
        console.log(`Searching for "${query}" using POST /api/filter...`);
        const res = await axios.post('https://api.hianime.bar/api/filter', { name: query });
        const results = res.data.results || [];
        
        console.log(`Total results: ${results.length}`);
        
        results.forEach((a, i) => {
            const epCount = a.episodes ? a.episodes.length : 0;
            console.log(`[${i}] Title: ${a.title} | Eps: ${epCount} | ID: ${a._id}`);
            if (a.title && a.title.toLowerCase().includes(query.toLowerCase())) {
                console.log(`  -> Match! Slugs: ${JSON.stringify(a.slugs ? a.slugs.slice(0, 5) : [])}`);
            }
        });

    } catch (err) {
        console.error("Filter failed:", err.message);
    }
}

checkFilter();
