const axios = require('axios');

async function debugAnime(slug) {
    try {
        const res = await axios.get(`https://api.hianime.bar/api/anime/${slug}`);
        const anime = res.data.anime;
        console.log(`Title: ${anime.title}`);
        console.log(`Total Episodes Meta: ${anime.totalEpisodes}`);
        console.log(`Episodes Array Length: ${anime.episodes.length}`);
        if (anime.slugs) {
            console.log(`Slugs Count: ${anime.slugs.length}`);
            console.log(`First Slug: ${anime.slugs[0]}`);
            console.log(`Mid Slug: ${anime.slugs[Math.floor(anime.slugs.length/2)]}`);
            console.log(`Last Slug: ${anime.slugs[anime.slugs.length-1]}`);
        } else {
            console.log('Slugs field missing');
        }
    } catch (e) {
        console.log(`Error fetching ${slug}: ${e.message}`);
    }
}

debugAnime('summer-time-rendering-5hwlkp');
debugAnime('synduality:-noir-part-2-quodq8');
