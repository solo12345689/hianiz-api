const axios = require('axios');

async function checkSummerTime() {
    try {
        console.log("Fetching full anime list...");
        const res = await axios.get('https://api.hianime.bar/api/anime?limit=2000');
        const all = res.data.animes;
        const matches = all.filter(a => (a.title || '').toLowerCase().includes('summer time rendering'));
        
        console.log(`Found ${matches.length} matches for "Summer Time Rendering".`);
        
        for (const m of matches) {
            const slug = m.slugs?.[0];
            console.log(`\nChecking Slug: ${slug}`);
            console.log(`Japanese Title: ${m.Japanese}`);
            console.log(`Total Episodes (metadata): ${m.totalEpisodes}`);
            
            try {
                const detRes = await axios.get(`https://api.hianime.bar/api/anime/${slug}`);
                const eps = detRes.data.anime.episodes;
                console.log(`Episodes in this record: ${eps.length}`);
                if (eps.length > 0) {
                    console.log(`Episode Numbers: ${eps.map(e => e.episodeNumber).join(', ')}`);
                }
            } catch (e) {
                console.log(`Failed to fetch details for ${slug}: ${e.message}`);
            }
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

checkSummerTime();
