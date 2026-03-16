const axios = require('axios');

async function testSlugs() {
    try {
        console.log("Fetching main anime object...");
        const res = await axios.get('https://api.hianime.bar/api/latest/anime?limit=1000');
        const anime = res.data.animes.find(a => a.title.includes('Summer Time Rendering'));
        const slugs = anime.slugs || [];
        
        console.log(`Found ${slugs.length} slugs. Testing first 10...`);
        
        const results = await Promise.all(slugs.slice(0, 10).map(async (s, i) => {
            try {
                const r = await axios.get(`https://api.hianime.bar/api/anime/${s}`);
                return { slug: s, ep: r.data.anime.episodes[0].episodeNumber, title: r.data.anime.episodes[0].title };
            } catch (e) {
                return { slug: s, error: e.message };
            }
        }));
        
        results.forEach((r, i) => {
            console.log(`[${i}] ${r.slug} => Ep: ${r.ep} | ${r.title}`);
        });

    } catch (err) {
        console.log("Error:", err.message);
    }
}

testSlugs();
