const axios = require('axios');

async function search() {
    try {
        console.log("Fetching animelist (limit 1000)...");
        const res = await axios.get('https://api.hianime.bar/api/animelist?limit=1000');
        const animes = res.data.animes || [];
        
        console.log(`Total animes in list: ${animes.length}`);
        
        // Filter by MAL ID or title
        const targetMalId = 47194;
        const targetTitle = "Summer Time Rendering";
        
        const matches = animes.filter(a => 
            a.mal_id === targetMalId || 
            (a.title && a.title.toLowerCase().includes(targetTitle.toLowerCase()))
        );
        
        console.log(`Found ${matches.length} matches for "${targetTitle}":`);
        
        const sorted = matches.sort((a, b) => {
            const epA = a.episodes && a.episodes[0] ? a.episodes[0].episodeNumber : 0;
            const epB = b.episodes && b.episodes[0] ? b.episodes[0].episodeNumber : 0;
            return epA - epB;
        });
        
        sorted.forEach(m => {
            const ep = m.episodes && m.episodes[0] ? m.episodes[0].episodeNumber : 'N/A';
            console.log(`- Ep ${ep}: ID=${m._id} | Slug=${m.slugs ? m.slugs[0] : 'N/A'}`);
        });

    } catch (err) {
        console.error("Search failed:", err.message);
    }
}

search();
