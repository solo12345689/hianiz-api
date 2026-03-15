const express = require('express');
const router = express.Router();
const {
    getHomePage,
    getAnimeInfo,
    getAnimeEpisodes,
    getEpisodeServers,
    getEpisodeSources,
    getSearch,
    getCategory,
    getGenreAnimes,
} = require('../controllers/hianime.controller');

// ── Home ──────────────────────────────────────────────────────────
router.get('/home', getHomePage);

// ── Search ────────────────────────────────────────────────────────
router.get('/search', getSearch);

// ── Anime Info ────────────────────────────────────────────────────
router.get('/anime/:animeId', getAnimeInfo);

// ── Episodes ──────────────────────────────────────────────────────
router.get('/anime/:animeId/episodes', getAnimeEpisodes);

// ── Episode Servers ───────────────────────────────────────────────
// ?animeEpisodeId=summer-time-rendering-5hwlkp?ep=1e3nmx
router.get('/episode/servers', getEpisodeServers);

// ── Episode Sources (Stream Links) ────────────────────────────────
// ?animeEpisodeId=...&server=s-2&category=sub
router.get('/episode/sources', getEpisodeSources);

// ── Category ──────────────────────────────────────────────────────
// categories: top-airing, top-upcoming, completed, recently-added
router.get('/category/:name', getCategory);

// ── Genre ─────────────────────────────────────────────────────────
router.get('/genre/:name', getGenreAnimes);

module.exports = router;
