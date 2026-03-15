const axiosInstance = require('../utils/axiosInstance');
const {
    parseAnimeCard,
    parseAnimeInfo,
    parseEpisodeList,
    parseEpisodeServers,
} = require('../parsers/hianime.parser');

// ------------------------------------------------------------------
// GET /api/v2/hianime/home
// ------------------------------------------------------------------
const getHomePage = async (req, res) => {
    try {
        const [latestRes, upcomingRes, airingRes] = await Promise.all([
            axiosInstance.get('/latest/anime'),
            axiosInstance.get('/anime/upcoming'),
            axiosInstance.get('/animelist?status=Currently%20Airing&limit=10&page=1'),
        ]);

        const latestEpisodeAnimes = (latestRes.data.animes || []).map(parseAnimeCard);
        const topUpcomingAnimes = (upcomingRes.data.data || upcomingRes.data.animes || []).map(parseAnimeCard);
        const topAiringAnimes = (airingRes.data.animes || []).map(parseAnimeCard);

        res.status(200).json({
            success: true,
            data: {
                latestEpisodeAnimes,
                topAiringAnimes,
                topUpcomingAnimes,
                trendingAnimes: [],
                spotlightAnimes: [],
            },
        });
    } catch (error) {
        console.error('[getHomePage]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/anime/:animeId
// ------------------------------------------------------------------
const getAnimeInfo = async (req, res) => {
    try {
        const { animeId } = req.params;
        const response = await axiosInstance.get(`/anime/${animeId}`);
        const doc = response.data.anime;

        const info = parseAnimeInfo(doc);

        res.status(200).json({
            success: true,
            data: {
                anime: { info },
                moreInfo: {
                    aired: doc.Aired,
                    genres: doc.genres,
                    status: doc.Status,
                    duration: doc.Duration,
                    studios: doc.Producers || doc.studios || null,
                },
            },
        });
    } catch (error) {
        console.error('[getAnimeInfo]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/anime/:animeId/episodes
// ------------------------------------------------------------------
const getAnimeEpisodes = async (req, res) => {
    try {
        const { animeId } = req.params;
        const response = await axiosInstance.get(`/anime/${animeId}`);
        const doc = response.data.anime;

        const episodes = parseEpisodeList(doc.episodes);

        res.status(200).json({
            success: true,
            data: {
                totalEpisodes: episodes.length,
                episodes,
            },
        });
    } catch (error) {
        console.error('[getAnimeEpisodes]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/episode/servers?animeEpisodeId={slug}
//
// The animeEpisodeId is the episode slug, e.g.:
// 'summer-time-rendering-episode-1-1e3nmx'
// From that we need to find the parent anime and the episode.
// Format: We store it as: animeSlug?ep=episodePublicId
// e.g.: 'summer-time-rendering-5hwlkp?ep=1e3nmx'
// ------------------------------------------------------------------
const getEpisodeServers = async (req, res) => {
    try {
        const { animeEpisodeId } = req.query;
        if (!animeEpisodeId) {
            return res.status(400).json({ success: false, message: 'animeEpisodeId is required' });
        }

        // Parse the compound ID: animeSlug?ep=publicId
        const [animeSlug, epParam] = animeEpisodeId.split('?ep=');
        if (!animeSlug) {
            return res.status(400).json({ success: false, message: 'Invalid animeEpisodeId format. Use: animeSlug?ep=publicId' });
        }

        const response = await axiosInstance.get(`/anime/${animeSlug}`);
        const doc = response.data.anime;

        // Find matching episode
        let targetEp = null;
        if (epParam) {
            // Find the episode whose slug ends with the publicId
            targetEp = doc.episodes.find(ep =>
                ep.slugs && ep.slugs.some(s => s.endsWith(`-${epParam}`))
            );
        } else {
            // Default to the first episode
            targetEp = doc.episodes[0];
        }

        if (!targetEp) {
            return res.status(404).json({ success: false, message: 'Episode not found' });
        }

        const servers = parseEpisodeServers(targetEp);

        res.status(200).json({
            success: true,
            data: {
                episodeId: animeEpisodeId,
                episodeNo: targetEp.episodeNumber,
                sub: servers.sub,
                dub: servers.dub,
                raw: [],
            },
        });
    } catch (error) {
        console.error('[getEpisodeServers]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/episode/sources?animeEpisodeId={slug}&server={name}&category={sub|dub}
// ------------------------------------------------------------------
const getEpisodeSources = async (req, res) => {
    try {
        const { animeEpisodeId, server = 's-2', category = 'sub' } = req.query;
        if (!animeEpisodeId) {
            return res.status(400).json({ success: false, message: 'animeEpisodeId is required' });
        }

        const [animeSlug, epParam] = animeEpisodeId.split('?ep=');
        const response = await axiosInstance.get(`/anime/${animeSlug}`);
        const doc = response.data.anime;

        // Find episode
        let targetEp = null;
        if (epParam) {
            targetEp = doc.episodes.find(ep =>
                ep.slugs && ep.slugs.some(s => s.endsWith(`-${epParam}`))
            );
        } else {
            targetEp = doc.episodes[0];
        }

        if (!targetEp) {
            return res.status(404).json({ success: false, message: 'Episode not found' });
        }

        // Get the appropriate stream URL
        const linkArray = category === 'dub'
            ? (targetEp.link.dub || [])
            : (targetEp.link.sub || []);

        if (!linkArray.length) {
            return res.status(404).json({ success: false, message: `No ${category} stream found` });
        }

        // Filter by server preference (e.g. 's-2', 'hd-1')
        let streamUrl = linkArray[0];
        const preferred = linkArray.find(url => url.includes(`/${server}/`));
        if (preferred) streamUrl = preferred;

        res.status(200).json({
            success: true,
            data: {
                headers: {
                    Referer: 'https://megaplay.buzz/',
                    'User-Agent': 'Mozilla/5.0',
                },
                sources: [
                    {
                        url: streamUrl,
                        isM3U8: false, // It's a megaplay embed, not direct m3u8
                        quality: 'auto',
                    },
                ],
                subtitles: [],
                anilistID: null,
                malID: doc.mal_id || null,
            },
        });
    } catch (error) {
        console.error('[getEpisodeSources]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/search?q={query}&page={page}
// ------------------------------------------------------------------
const getSearch = async (req, res) => {
    try {
        const { q, page = 1, limit = 20 } = req.query;
        if (!q) return res.status(400).json({ success: false, message: 'q is required' });

        // The backend doesn't have a dedicated search endpoint.
        // We fetch a large list and filter client-side.
        const response = await axiosInstance.get(`/animelist?page=${page}&limit=50`);
        const allAnimes = response.data.animes || [];

        const filtered = allAnimes.filter(a =>
            (a.title || '').toLowerCase().includes(q.toLowerCase()) ||
            (a.English || '').toLowerCase().includes(q.toLowerCase()) ||
            (a.Japanese || '').toLowerCase().includes(q.toLowerCase())
        );

        const animes = filtered.map(parseAnimeCard);

        res.status(200).json({
            success: true,
            data: {
                animes,
                currentPage: parseInt(page),
                totalPages: response.data.meta?.totalPages || response.data.totalPages || 1,
                hasNextPage: (response.data.meta?.totalPages || 1) > parseInt(page),
                searchQuery: q,
            },
        });
    } catch (error) {
        console.error('[getSearch]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/category/:name?page={page}
// ------------------------------------------------------------------
const getCategory = async (req, res) => {
    try {
        const { name } = req.params;
        const { page = 1, limit = 20 } = req.query;

        // Map category names to backend filters
        const statusMap = {
            'top-airing': 'Currently Airing',
            'top-upcoming': 'upcoming',
            'recently-added': undefined,
            'completed': 'Finished Airing',
        };

        const statusFilter = statusMap[name];
        const params = new URLSearchParams({ page, limit });
        if (statusFilter) params.set('status', statusFilter);

        const response = await axiosInstance.get(`/animelist?${params.toString()}`);
        const animes = (response.data.animes || []).map(parseAnimeCard);

        res.status(200).json({
            success: true,
            data: {
                category: name,
                animes,
                currentPage: parseInt(page),
                totalPages: response.data.meta?.totalPages || response.data.totalPages || 1,
                hasNextPage: (response.data.meta?.totalPages || 1) > parseInt(page),
            },
        });
    } catch (error) {
        console.error('[getCategory]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/genre/:name?page={page}
// ------------------------------------------------------------------
const getGenreAnimes = async (req, res) => {
    try {
        const { name } = req.params;
        const { page = 1, limit = 24 } = req.query;

        // The /filter endpoint requires POST with the correct body.
        // Genre names must be capitalized e.g. 'Action', 'Romance'
        const genreName = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        const response = await axiosInstance.post('/filter', {
            genre: [genreName],
            page: parseInt(page),
            limit: parseInt(limit),
        });

        const animes = (response.data.results || response.data.animes || []).map(parseAnimeCard);

        res.status(200).json({
            success: true,
            data: {
                genreName,
                animes,
                currentPage: parseInt(page),
                totalPages: response.data.totalPages || 1,
                hasNextPage: (response.data.totalPages || 1) > parseInt(page),
            },
        });
    } catch (error) {
        console.error('[getGenreAnimes]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getHomePage,
    getAnimeInfo,
    getAnimeEpisodes,
    getEpisodeServers,
    getEpisodeSources,
    getSearch,
    getCategory,
    getGenreAnimes,
};
