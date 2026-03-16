const axios = require('axios');
const fs = require('fs');

async function findAnime() {
    try {
        console.log("Fetching all animes...");
        const res = await axios.post('https://api.hianime.bar/api/filter', { limit: 2000 });
        const animes = res.data.results;
        console.log(`Fetched ${animes.length} animes.`);
        
        const target = animes.find(a => 
            (a.title || '').toLowerCase().includes('summer time rendering') ||
            (a.English || '').toLowerCase().includes('summer time rendering')
        );
        
        if (target) {
            console.log("Found it!");
            console.log("Title:", target.title);
            console.log("Episodes:", target.episodes ? target.episodes.length : 0);
            if (target.episodes && target.episodes.length > 0) {
                console.log("First Episode IDs:", JSON.stringify(target.episodes[0].link, null, 2));
            }
            fs.writeFileSync('summer_time_found.json', JSON.stringify(target, null, 2));
        } else {
            console.log("Summer Time Rendering not found in the list.");
        }
    } catch (e) {
        console.error(e.message);
    }
}

findAnime();
