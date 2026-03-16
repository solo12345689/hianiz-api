const axios = require('axios');

async function getAll() {
    const results = [];
    const target = 'Summer Time Rendering';
    
    console.log(`Searching for all episodes of "${target}"...`);
    
    for (let page = 1; page <= 5; page++) {
        try {
            console.log(`Fetching page ${page}...`);
            const res = await axios.post('https://api.hianime.bar/api/filter', { 
                name: target,
                page: page,
                limit: 100
            });
            const list = res.data.results || [];
            if (list.length === 0) break;
            
            list.forEach(a => {
                if (a.title && a.title.toLowerCase().includes(target.toLowerCase())) {
                    results.push({
                        title: a.title,
                        ep: a.episodes && a.episodes[0] ? a.episodes[0].episodeNumber : '?',
                        id: a._id,
                        slug: a.slugs ? a.slugs[0] : 'N/A',
                        sub: a.totalSubbed,
                        dub: a.totalDubbed
                    });
                }
            });
        } catch (e) {
            console.log(`Error on page ${page}: ${e.message}`);
        }
    }
    
    console.log(`Found ${results.length} episodic records:`);
    results.sort((a, b) => a.ep - b.ep).forEach(r => {
        console.log(`- Ep ${r.ep}: ${r.title} [${r.id}] (Sub: ${r.sub}, Dub: ${r.dub})`);
    });
}

getAll();
