const axiosInstance = require('../utils/axiosInstance');
const {
    parseAnimeCard,
    parseAnimeInfo,
    parseEpisodeList,
    parseEpisodeServers,
    extractStreamId,
} = require('../parsers/hianime.parser');
const { collectAllEpisodes } = require('../utils/collector');

// ------------------------------------------------------------------
// GET /api/v2/hianime/home
// ------------------------------------------------------------------
const getHomePage = async (req, res) => {
    try {
        const [latestRes, upcomingRes, airingRes, animelistRes] = await Promise.all([
            axiosInstance.get('/latest/anime'),
            axiosInstance.get('/anime/upcoming'),
            axiosInstance.get('/animelist?status=Currently%20Airing&limit=20&page=1'),
            axiosInstance.get('/animelist?limit=100&page=1'),
        ]);

        const allAnimes = animelistRes.data.animes || [];
        
        // Extract genres from all fetched animes
        const genresSet = new Set();
        allAnimes.forEach(a => {
            if (a.genres && Array.isArray(a.genres)) {
                a.genres.forEach(g => genresSet.add(g));
            }
        });

        const latestEpisodeAnimes = (latestRes.data.animes || []).map(parseAnimeCard);
        const topUpcomingAnimes = (upcomingRes.data.data || upcomingRes.data.animes || []).map(parseAnimeCard);
        const topAiringAnimes = (airingRes.data.animes || []).map(parseAnimeCard);
        
        // Simulate other lists using the larger animelist
        const mostPopularAnimes = [...allAnimes]
            .sort((a, b) => (parseInt(b.Popularity) || 0) - (parseInt(a.Popularity) || 0))
            .slice(0, 10).map(parseAnimeCard);
            
        const mostFavoriteAnimes = [...allAnimes]
            .sort((a, b) => (parseInt(b.Favorites) || 0) - (parseInt(a.Favorites) || 0))
            .slice(0, 10).map(parseAnimeCard);

        const latestCompletedAnimes = allAnimes
            .filter(a => a.Status === 'Finished Airing')
            .slice(0, 10).map(parseAnimeCard);

        const trendingAnimes = [...allAnimes]
            .sort(() => 0.5 - Math.random())
            .slice(0, 10).map((a, i) => ({ ...parseAnimeCard(a), rank: i + 1 }));

        const spotlightAnimes = [...allAnimes].slice(0, 5).map((a, i) => ({
            ...parseAnimeCard(a),
            description: a.synopsis || '',
            rank: i + 1,
            otherInfo: [a.Type, a.Duration, a.Aired].filter(Boolean),
        }));

        const top10today = [...allAnimes].slice(0, 10).map((a, i) => ({ ...parseAnimeCard(a), rank: i + 1 }));

        res.status(200).json({
            success: true,
            data: {
                genres: Array.from(genresSet).sort(),
                latestEpisodeAnimes,
                spotlightAnimes,
                top10Animes: {
                    today: top10today,
                    week: top10today,
                    month: top10today,
                },
                topAiringAnimes,
                topUpcomingAnimes,
                trendingAnimes,
                mostPopularAnimes,
                mostFavoriteAnimes,
                latestCompletedAnimes,
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
                    aired: doc.Aired || info.aired,
                    genres: doc.genres || info.genres || [],
                    status: doc.Status || info.status,
                    duration: doc.Duration || info.duration,
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

        // Collect all episodes (consolidating from scattered backend records if needed)
        const allEps = await collectAllEpisodes(animeId, doc);
        const episodes = parseEpisodeList(allEps, animeId);

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
// GET /api/v2/hianime/episode/servers?animeEpisodeId={id}
// animeEpisodeId format: "anime-slug?ep=numericId"
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// GET /api/v2/hianime/episode/servers?animeEpisodeId={slug}
//
// The animeEpisodeId is the compound ID: animeSlug?ep=publicId
// ------------------------------------------------------------------
const getEpisodeServers = async (req, res) => {
    try {
        const { animeEpisodeId } = req.query;
        if (!animeEpisodeId) {
            return res.status(400).json({ success: false, message: 'animeEpisodeId is required' });
        }

        const [animeSlug, epParam] = animeEpisodeId.split('?ep=');
        if (!animeSlug) {
            return res.status(400).json({ success: false, message: 'Invalid animeEpisodeId format. Use: animeSlug?ep=publicId' });
        }

        const response = await axiosInstance.get(`/anime/${animeSlug}`);
        const doc = response.data.anime;

        // Find matching episode
        let targetEp = null;
        if (epParam) {
            // Try matching by streamId first, then by episodeNumber
            targetEp = doc.episodes.find(ep => {
                const subId = ep.link?.sub?.[0] ? extractStreamId(ep.link.sub[0]) : null;
                const dubId = ep.link?.dub?.[0] ? extractStreamId(ep.link.dub[0]) : null;
                return subId === epParam || dubId === epParam || ep.episodeNumber?.toString() === epParam;
            });
        } else {
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
            // Try matching by streamId first, then by episodeNumber
            targetEp = doc.episodes.find(ep => {
                const subId = ep.link?.sub?.[0] ? extractStreamId(ep.link.sub[0]) : null;
                const dubId = ep.link?.dub?.[0] ? extractStreamId(ep.link.dub[0]) : null;
                return subId === epParam || dubId === epParam || ep.episodeNumber?.toString() === epParam;
            });
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

        // Filter by server preference
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
                        isM3U8: streamUrl.includes('.m3u8'),
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
        const { 
            q, 
            page = 1, 
            limit = 20, 
            genres, 
            type, 
            status, 
            rated, 
            score, 
            season, 
            language,
            sort
        } = req.query;

        let results = [];
        let totalPages = 1;

        if (q) {
            // The backend's search query parameters (q, title, keyword) are currently broken 
            // and return the default list. To provide accurate search, we fetch the full list 
            // and filter locally.
            const searchRes = await axiosInstance.get('/anime?limit=2000');
            const allAnimes = searchRes.data.animes || [];
            const query = q.toLowerCase();
            
            results = allAnimes.filter(a => 
                (a.title || '').toLowerCase().includes(query) ||
                (a.English || '').toLowerCase().includes(query) ||
                (a.Japanese || '').toLowerCase().includes(query) ||
                (a.alternateTitle || '').toLowerCase().includes(query)
            );

            // Simple relevance sorting: exact matches first
            results.sort((a, b) => {
                const aTitle = (a.title || '').toLowerCase();
                const bTitle = (b.title || '').toLowerCase();
                if (aTitle === query) return -1;
                if (bTitle === query) return 1;
                return 0;
            });

            // Pagination for local results
            totalPages = Math.ceil(results.length / limit);
            results = results.slice((page - 1) * limit, page * limit);
        } else {
            // Priority 2: Use filters if no query
            const filterPayload = {};
            if (genres) filterPayload.genres = genres.split(',');
            if (type) filterPayload.Type = type;
            if (status) filterPayload.Status = status;
            if (rated) filterPayload.Rating = rated;

            const filterRes = await axiosInstance.post('/filter', filterPayload, { params: { page, limit } });
            results = filterRes.data.results || [];
            totalPages = filterRes.data.totalPages || 1;
        }

        const [popularRes] = await Promise.all([
            axiosInstance.get('/animelist?sort=Popularity&limit=10')
        ]);

        const animes = results.map(parseAnimeCard);
        const mostPopularAnimes = (popularRes.data.animes || []).map(parseAnimeCard);

        res.status(200).json({
            success: true,
            data: {
                animes,
                mostPopularAnimes,
                currentPage: parseInt(page),
                totalPages,
                hasNextPage: totalPages > parseInt(page),
                searchQuery: q || '',
                searchFilters: req.query,
            },
        });
    } catch (error) {
        console.error('[getSearch]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/search/suggestion?q={query}
// ------------------------------------------------------------------
const getSearchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ success: false, message: 'q is required' });

        const response = await axiosInstance.get('/animelist?limit=100');
        const query = q.toLowerCase();
        const suggestions = (response.data.animes || [])
            .filter(a => 
                (a.title || '').toLowerCase().includes(query) ||
                (a.English || '').toLowerCase().includes(query)
            )
            .slice(0, 10)
            .map(a => ({
                id: (a.slugs && a.slugs[0]) || a._id,
                name: a.title,
                poster: a.image,
                jname: a.Japanese,
                moreInfo: [a.Aired, a.Type, a.Duration].filter(Boolean)
            }));

        res.status(200).json({
            success: true,
            data: { suggestions }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/schedule?date={date}
// ------------------------------------------------------------------
const getSchedule = async (req, res) => {
    try {
        const { date } = req.query; // yyyy-mm-dd
        // Backend doesn't have a schedule endpoint, simulate with currently airing
        const response = await axiosInstance.get('/animelist?status=Currently%20Airing&limit=20');
        const scheduledAnimes = (response.data.animes || []).map(a => ({
            id: (a.slugs && a.slugs[0]) || a._id,
            time: "12:00", // Placeholder
            name: a.title,
            jname: a.Japanese,
            airingTimestamp: Date.now(),
            secondsUntilAiring: 0
        }));

        res.status(200).json({
            success: true,
            data: { scheduledAnimes }
        });
    } catch (error) {
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

        const statusMap = {
            'top-airing': 'Currently Airing',
            'top-upcoming': 'upcoming',
            'completed': 'Finished Airing',
        };

        const statusFilter = statusMap[name];
        const [catRes, allRes] = await Promise.all([
            axiosInstance.get('/animelist', { params: { status: statusFilter, page, limit } }),
            axiosInstance.get('/animelist?limit=50')
        ]);

        const animes = (catRes.data.animes || []).map(parseAnimeCard);
        const genresSet = new Set();
        (allRes.data.animes || []).forEach(a => (a.genres || []).forEach(g => genresSet.add(g)));

        res.status(200).json({
            success: true,
            data: {
                category: name,
                animes,
                genres: Array.from(genresSet).sort(),
                currentPage: parseInt(page),
                totalPages: catRes.data.meta?.totalPages || catRes.data.totalPages || 1,
                hasNextPage: (catRes.data.meta?.totalPages || 1) > parseInt(page),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/genre/:name?page={page}
// ------------------------------------------------------------------
const getGenreAnimes = async (req, res) => {
    try {
        const { name } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const genreName = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        const [genreRes, airingRes, allRes] = await Promise.all([
            axiosInstance.post('/filter', { genres: [genreName] }, { params: { page, limit } }),
            axiosInstance.get('/animelist?status=Currently%20Airing&limit=10'),
            axiosInstance.get('/animelist?limit=50')
        ]);

        const animes = (genreRes.data.results || []).map(parseAnimeCard);
        const topAiringAnimes = (airingRes.data.animes || []).map(parseAnimeCard);
        
        const genresSet = new Set();
        (allRes.data.animes || []).forEach(a => (a.genres || []).forEach(g => genresSet.add(g)));

        res.status(200).json({
            success: true,
            data: {
                genreName: `${genreName} Anime`,
                animes,
                genres: Array.from(genresSet).sort(),
                topAiringAnimes,
                currentPage: parseInt(page),
                totalPages: genreRes.data.totalPages || 1,
                hasNextPage: (genreRes.data.totalPages || 1) > parseInt(page),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/producer/:name?page={page}
// ------------------------------------------------------------------
const getProducerAnimes = async (req, res) => {
    try {
        const { name } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const producerName = name.replace(/-/g, ' ');

        const [prodRes, airingRes] = await Promise.all([
            axiosInstance.post('/filter', { producer: producerName }, { params: { page, limit } }),
            axiosInstance.get('/animelist?status=Currently Airing&limit=10')
        ]);

        const animes = (prodRes.data.results || []).map(parseAnimeCard);
        const topAiringAnimes = (airingRes.data.animes || []).map(parseAnimeCard);

        res.status(200).json({
            success: true,
            data: {
                producerName: `${producerName} Anime`,
                animes,
                topAiringAnimes,
                currentPage: parseInt(page),
                totalPages: prodRes.data.totalPages || 1,
                hasNextPage: (prodRes.data.totalPages || 1) > parseInt(page),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/azlist/:sortOption?page={page}
// ------------------------------------------------------------------
const getAZList = async (req, res) => {
    try {
        const { sortOption } = req.params;
        const { page = 1, limit = 20 } = req.query;
        
        // Simulating AZ list by filtering the main list
        const response = await axiosInstance.get('/animelist', { params: { page, limit: 100 } });
        let animes = response.data.animes || [];
        
        if (sortOption && sortOption !== 'all') {
            const char = sortOption.toUpperCase();
            if (char === '0-9') {
                animes = animes.filter(a => /^[0-9]/.test(a.title));
            } else if (char === 'OTHER') {
                animes = animes.filter(a => /^[^A-Z0-9]/i.test(a.title));
            } else {
                animes = animes.filter(a => (a.title || '').toUpperCase().startsWith(char));
            }
        }

        res.status(200).json({
            success: true,
            data: {
                animes: animes.map(parseAnimeCard),
                currentPage: parseInt(page),
                totalPages: 1,
                hasNextPage: false
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/anime/qtip/:id
// ------------------------------------------------------------------
const getQtipInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axiosInstance.get(`/anime/${id}`);
        const doc = response.data.anime;
        const info = parseAnimeInfo(doc);

        res.status(200).json({
            success: true,
            data: {
                title: info.name,
                jname: info.jname,
                poster: info.poster,
                description: info.description,
                type: info.type,
                status: info.status,
                duration: info.duration,
                released: doc.Aired || info.aired,
                score: doc.Score || null,
                genres: doc.genres || info.genres,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/anime/about/:id
// ------------------------------------------------------------------
const getAboutInfo = async (req, res) => {
    // Usually About info is same as Info or has more details
    return getAnimeInfo(req, res);
};

// ------------------------------------------------------------------
// GET /api/v2/hianime/anime/:id/next-episode-schedule
// ------------------------------------------------------------------
const getNextEpisodeSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axiosInstance.get(`/anime/${id}`);
        const doc = response.data.anime;

        res.status(200).json({
            success: true,
            data: {
                airingISOTimestamp: null,
                airingTimestamp: null,
                secondsUntilAiring: null
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getHomePage,
    getAnimeInfo,
    getAboutInfo,
    getQtipInfo,
    getAnimeEpisodes,
    getEpisodeServers,
    getEpisodeSources,
    getSearch,
    getSearchSuggestions,
    getCategory,
    getGenreAnimes,
    getProducerAnimes,
    getSchedule,
    getAZList,
    getNextEpisodeSchedule
};
