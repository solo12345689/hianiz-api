/**
 * HiAnime Backend Data Structure (Discovered)
 * 
 * GET /api/latest/anime
 * GET /api/animelist?status=Currently+Airing&page=1&limit=20
 * GET /api/anime/upcoming
 * GET /api/anime/{slug}
 * 
 * Response shape from /api/anime/{slug}:
 * {
 *   anime: {
 *     _id, title, English, Japanese, image, synopsis,
 *     Type, totalEpisodes, totalSubbed, totalDubbed,
 *     Status, Aired, Duration, Rating, Score, genres,
 *     public_id: ['a1b2c3', ...],   // per-episode IDs
 *     slugs: ['anime-name-a1b2c3', ...],  // per-episode watch slugs
 *     episodes: [
 *       {
 *         episodeNumber: 1,
 *         link: {
 *           sub: ['https://megaplay.buzz/stream/s-2/89776/sub'],
 *           dub: []
 *         },
 *         slugs: ['anime-name-episode-1-a1b2c3', ...]
 *       }
 *     ]
 *   }
 * }
 *
 * The watch URL is: /watch/{episodeSlug}
 * The stream URL is megaplay.buzz/stream/s-2/{numericId}/{sub|dub}
 *
 * So: episodeSlug = 'summer-time-rendering-episode-1-1e3nmx'
 *     streamUrl   = 'https://megaplay.buzz/stream/s-2/89776/sub'
 *
 * The megaplay numeric ID (89776) = the episode's stream ID on megaplay.
 */
