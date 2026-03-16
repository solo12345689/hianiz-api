/**
 * HiAnime Backend Data Parser
 * Maps raw API responses from api.hianime.bar into the Aniwatch API format.
 */

/**
 * Extract numeric stream ID from megaplay URL.
 * e.g. 'https://megaplay.buzz/stream/s-2/89776/sub' => '89776'
 */
const extractStreamId = (megaplayUrl) => {
    if (!megaplayUrl) return null;
    const match = megaplayUrl.match(/\/(\d+)\/(sub|dub)$/);
    return match ? match[1] : null;
};

/**
 * Extract episode public_id from the slugs array.
 * e.g. 'summer-time-rendering-episode-1-1e3nmx' => '1e3nmx'
 */
const extractPublicId = (slug) => {
    if (!slug) return null;
    const parts = slug.split('-');
    return parts[parts.length - 1];
};

/**
 * Map a raw anime record from api.hianime.bar to the Aniwatch API shape.
 */
const parseAnimeCard = (anime) => {
    const animeId = (anime.slugs && anime.slugs[0]) || anime._id || '';
    return {
        id: animeId,
        name: anime.title || anime.English || '',
        jname: anime.Japanese || '',
        poster: anime.image || '',
        duration: anime.Duration || '',
        type: anime.Type || 'Unknown',
        rating: anime.Rating || '',
        episodes: {
            sub: parseInt(anime.totalSubbed) || parseInt(anime.totalEpisodes) || 0,
            dub: parseInt(anime.totalDubbed) || 0,
        },
    };
};

/**
 * Parse full anime info from /api/anime/{slug}
 */
const parseAnimeInfo = (animeDoc) => {
    return {
        id: (animeDoc.slugs && animeDoc.slugs[0]) || animeDoc._id || '',
        name: animeDoc.title || animeDoc.English || '',
        jname: animeDoc.Japanese || '',
        poster: animeDoc.image || '',
        description: animeDoc.synopsis || '',
        type: animeDoc.Type || 'Unknown',
        rating: animeDoc.Rating || '',
        duration: animeDoc.Duration || '',
        status: animeDoc.Status || '',
        aired: animeDoc.Aired || '',
        genres: animeDoc.genres || [],
        score: animeDoc.Score || '',
        ranked: animeDoc.Ranked || '',
        popularity: animeDoc.Popularity || '',
        episodes: {
            sub: parseInt(animeDoc.totalSubbed) || parseInt(animeDoc.totalEpisodes) || 0,
            dub: parseInt(animeDoc.totalDubbed) || 0,
        },
        mal_id: animeDoc.mal_id || null,
    };
};

/**
 * Parse episode list from /api/anime/{slug}
 * Each episode has link.sub[], link.dub[], slugs[], episodeNumber
 */
const parseEpisodeList = (episodes, animeSlug) => {
    if (!episodes || !Array.isArray(episodes)) return [];

    return episodes.map((ep) => {
        const epSlug = ep.slugs && ep.slugs[0] ? ep.slugs[0] : null;
        const publicId = extractPublicId(epSlug);
        const streamId = (ep.link && ep.link.sub && ep.link.sub[0]) 
            ? extractStreamId(ep.link.sub[0]) 
            : (ep.link && ep.link.dub && ep.link.dub[0])
                ? extractStreamId(ep.link.dub[0])
                : null;

        // Use the episode number for the ID to make it predictable (e.g. ?ep=1)
        const episodeId = `${animeSlug}?ep=${ep.episodeNumber}`;

        return {
            number: ep.episodeNumber,
            title: ep.title || `Episode ${ep.episodeNumber}`,
            episodeId: episodeId,
            isFiller: ep.isFiller || false,
        };
    });
};

/**
 * Parse streaming servers from an episode object.
 * Returns sub/dub server lists with megaplay URLs.
 */
const parseEpisodeServers = (episode) => {
    const subServers = [];
    const dubServers = [];

    if (episode.link && episode.link.sub) {
        episode.link.sub.forEach((url, i) => {
            const id = extractStreamId(url);
            if (id) {
                // Determine server name from URL format:
                // megaplay.buzz/stream/s-2/... => server "hd-2"
                const serverMatch = url.match(/\/stream\/(s-\d+)\//);
                const serverName = serverMatch ? serverMatch[1] : 'hd-1';
                subServers.push({
                    serverId: i + 1,
                    serverName,
                    streamId: id,
                    url,
                });
            }
        });
    }

    if (episode.link && episode.link.dub) {
        episode.link.dub.forEach((url, i) => {
            const id = extractStreamId(url);
            if (id) {
                const serverMatch = url.match(/\/stream\/(s-\d+)\//);
                const serverName = serverMatch ? serverMatch[1] : 'hd-1';
                dubServers.push({
                    serverId: i + 1,
                    serverName,
                    streamId: id,
                    url,
                });
            }
        });
    }

    return { sub: subServers, dub: dubServers };
};

module.exports = {
    parseAnimeCard,
    parseAnimeInfo,
    parseEpisodeList,
    parseEpisodeServers,
    extractStreamId,
    extractPublicId,
};
