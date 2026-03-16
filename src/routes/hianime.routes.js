const express = require('express');
const router = express.Router();
const {
    getHomePage,
    getAnimeInfo,
    getAnimeEpisodes,
    getEpisodeServers,
    getAllEpisodeServers,
    getEpisodeSources,
    getSearch,
    getSearchSuggestions,
    getCategory,
    getGenreAnimes,
    getProducerAnimes,
    getSchedule,
    getAZList,
    getQtipInfo,
    getAboutInfo,
    getNextEpisodeSchedule
} = require('../controllers/hianime.controller');

// ── Home ──────────────────────────────────────────────────────────
router.get('/home', getHomePage);

// ── Search ────────────────────────────────────────────────────────
router.get('/search', getSearch);
router.get('/search/suggestion', getSearchSuggestions);

// ── Anime Info ────────────────────────────────────────────────────
router.get('/anime/:animeId', getAnimeInfo);
router.get('/qtip/:animeId', getQtipInfo);
router.get('/anime/about/:animeId', getAboutInfo);

// ── Episodes ──────────────────────────────────────────────────────
router.get('/anime/:animeId/episodes', getAnimeEpisodes);
router.get('/anime/:animeId/next-episode-schedule', getNextEpisodeSchedule);

// ── Episode Servers ───────────────────────────────────────────────
// ?animeEpisodeId=summer-time-rendering-5hwlkp?ep=1
router.get('/episode/servers', getEpisodeServers);

// ── All Episode Servers (all episodes at once) ────────────────────
// GET /anime/:animeId/episode/servers
router.get('/anime/:animeId/episode/servers', getAllEpisodeServers);

// ── Episode Sources (Stream Links) ────────────────────────────────
// ?animeEpisodeId=...&server=s-2&category=sub
router.get('/episode/sources', getEpisodeSources);

// ── Category ──────────────────────────────────────────────────────
router.get('/category/:name', getCategory);

// ── Genre ─────────────────────────────────────────────────────────
router.get('/genre/:name', getGenreAnimes);

// ── Producer ──────────────────────────────────────────────────────
router.get('/producer/:name', getProducerAnimes);

// ── Schedule ──────────────────────────────────────────────────────
router.get('/schedule', getSchedule);

// ── AZ List ───────────────────────────────────────────────────────
router.get('/azlist/:sortOption', getAZList);

module.exports = router;
