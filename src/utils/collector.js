const axiosInstance = require('./axiosInstance');

/**
 * HiAnime Episode Collector
 * Some backend records only return the latest episode. 
 * This utility collects all related episode records if they are scattered.
 */
async function collectAllEpisodes(animeId, mainDoc) {
    const episodes = [];
    const malId = mainDoc.mal_id;
    const title = mainDoc.title || mainDoc.English;

    // 1. Start with episodes from the main document
    if (mainDoc.episodes && Array.isArray(mainDoc.episodes)) {
        episodes.push(...mainDoc.episodes);
    }

    // 2. If we only have 1 episode but the show has many, try searching the backend
    if (episodes.length === 1 && parseInt(mainDoc.totalEpisodes) > 1) {
        try {
            // Search in both latest/anime and animelist with broad limits
            const [latestRes, listRes] = await Promise.all([
                axiosInstance.get('/latest/anime?limit=1000'),
                axiosInstance.get(`/animelist?title=${encodeURIComponent(title)}&limit=100`)
            ]);

            const allFound = [
                ...(latestRes.data.animes || []),
                ...(listRes.data.animes || [])
            ];

            const related = allFound.filter(a => {
                const sameMal = malId && a.mal_id === malId;
                const sameTitle = title && a.title && a.title.toLowerCase().includes(title.toLowerCase());
                return sameMal || sameTitle;
            });

            related.forEach(m => {
                if (m.episodes && Array.isArray(m.episodes)) {
                    m.episodes.forEach(ep => {
                        if (!episodes.find(e => e.episodeNumber === ep.episodeNumber)) {
                            episodes.push(ep);
                        }
                    });
                }
            });
        } catch (e) {
            console.log('[Collector] Search failed:', e.message);
        }
    }

    // Sort by episode number
    return episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
}

module.exports = { collectAllEpisodes };
