require('dotenv').config();
const express = require('express');
const cors = require('cors');

const hianimeRoutes = require('./routes/hianime.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/v2/hianime', hianimeRoutes);

// ── Root ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        message: 'Hianiz API - Unofficial REST API',
        version: '1.0.0',
        endpoints: {
            home: 'GET /api/v2/hianime/home',
            search: 'GET /api/v2/hianime/search?q={query}',
            animeInfo: 'GET /api/v2/hianime/anime/{animeId}',
            episodes: 'GET /api/v2/hianime/anime/{animeId}/episodes',
            servers: 'GET /api/v2/hianime/episode/servers?animeEpisodeId={animeSlug}?ep={publicId}',
            sources: 'GET /api/v2/hianime/episode/sources?animeEpisodeId={...}&server=s-2&category=sub',
            category: 'GET /api/v2/hianime/category/{name}',
            genre: 'GET /api/v2/hianime/genre/{name}',
        },
        backend: 'api.hianime.bar',
    });
});

// ── 404 Handler ───────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ── Error Handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('[Error]', err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📖 API docs at http://localhost:${PORT}/`);
});
