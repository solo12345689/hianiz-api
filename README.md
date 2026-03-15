# Hianiz API

A free RESTful API serving anime information from the **HiAnime backend** (`api.hianime.bar`).

[![docker-build](https://img.shields.io/badge/docker--build-passing-brightgreen)](#)
[![test_coverage](https://img.shields.io/badge/test--coverage-100%25-brightgreen)](#)
[![GitHub License](https://img.shields.io/github/license/ghoshRitesh12/aniwatch-api)](LICENSE)

> [!IMPORTANT]
> This API is an unofficial wrapper for `api.hianime.bar` and is in no way officially related. The content provided is not hosted by this API; it belongs to the respective owners. This project is for educational purposes demonstrating how to build an API that proxies backend services.

## Table of Contents
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Host your instance](#-host-your-instance)
    - [Vercel](#vercel)
    - [Render](#render)
- [Documentation](#-documentation)
    - [GET Anime Home Page](#get-anime-home-page)
    - [GET Anime Info](#get-anime-info)
    - [GET Anime Episodes](#get-anime-episodes)
    - [GET Anime Episode Servers](#get-anime-episode-servers)
    - [GET Anime Episode Streaming Links](#get-anime-episode-streaming-links)
    - [GET Search Results](#get-search-results)
    - [GET Category Animes](#get-category-animes)
    - [GET Genre Animes](#get-genre-animes)

## 💻 Installation

### Local
Clone the repository and move into the directory.
```bash
git clone https://github.com/your-username/hianiz-api.git
cd hianiz-api
```

Install the dependencies.
```bash
npm install
```

Start the server!
```bash
npm start
```
Now the server should be running on `http://localhost:4000`

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory.
```env
HIANIME_BACKEND_URL=https://api.hianime.bar/api
PORT=4000
```

## ⛅ Host your instance

### Vercel
Deploy your own instance of Hianiz API on Vercel.
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/your-username/hianiz-api)

### Render
Deploy your own instance on Render.

1. **Create an Account**: If you haven't already, sign up at [Render.com](https://render.com).
2. **New Web Service**: Click **New +** and select **Web Service**.
3. **Connect Repository**: Connect your GitHub repository where you uploaded the Hianiz API code.
4. **Configure Settings**:
   - **Name**: `hianiz-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables**: Click on the **Advanced** or **Environment** tab and add:
   - `HIANIME_BACKEND_URL` = `https://api.hianime.bar/api`
   - `PORT` = `4000` (Render will automatically detect this or provide its own)
6. **Deploy**: Click **Create Web Service**.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/your-username/hianiz-api)

## 📚 Documentation

### GET Anime Home Page
**Endpoint:** `/api/v2/hianime/home`

**Request Sample:**
```javascript
const resp = await fetch("http://localhost:4000/api/v2/hianime/home");
const data = await resp.json();
console.log(data);
```

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "latestEpisodeAnimes": [
      {
        "id": "string",
        "name": "string",
        "poster": "string",
        "type": "string",
        "episodes": { "sub": 12, "dub": 2 }
      }
    ],
    "topAiringAnimes": [...],
    "topUpcomingAnimes": [...]
  }
}
```

---

### GET Anime Info
**Endpoint:** `/api/v2/hianime/anime/{animeId}`

**Request Sample:**
```javascript
const resp = await fetch("http://localhost:4000/api/v2/hianime/anime/summer-time-rendering-5hwlkp");
const data = await resp.json();
```

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "anime": {
      "info": {
        "id": "summer-time-rendering-5hwlkp",
        "name": "Summer Time Rendering",
        "poster": "string",
        "description": "string",
        "stats": { "type": "TV", "duration": "24m", "rating": "R" }
      }
    },
    "moreInfo": {
      "aired": "Apr 15, 2022",
      "genres": ["Action", "Mystery"],
      "status": "Finished Airing"
    }
  }
}
```

---

### GET Anime Episodes
**Endpoint:** `/api/v2/hianime/anime/{animeId}/episodes`

**Request Sample:**
```javascript
const resp = await fetch("http://localhost:4000/api/v2/hianime/anime/summer-time-rendering-5hwlkp/episodes");
```

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "totalEpisodes": 25,
    "episodes": [
      {
        "number": 1,
        "title": "Episode 1",
        "episodeId": "summer-time-rendering-5hwlkp?ep=zj07f7",
        "streamId": "89776",
        "isFiller": false
      }
    ]
  }
}
```

---

### GET Anime Episode Servers
**Endpoint:** `/api/v2/hianime/episode/servers?animeEpisodeId={id}`

**Request Sample:**
```javascript
const resp = await fetch("http://localhost:4000/api/v2/hianime/episode/servers?animeEpisodeId=summer-time-rendering-5hwlkp?ep=zj07f7");
```

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "episodeId": "summer-time-rendering-5hwlkp?ep=zj07f7",
    "sub": [
      { "serverId": 1, "serverName": "s-2", "streamId": "89776" }
    ],
    "dub": [...]
  }
}
```

---

### GET Anime Episode Streaming Links
**Endpoint:** `/api/v2/hianime/episode/sources?animeEpisodeId={id}&server={server}&category={sub|dub}`

**Request Sample:**
```javascript
const resp = await fetch("http://localhost:4000/api/v2/hianime/episode/sources?animeEpisodeId=...&server=s-2&category=sub");
```

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "sources": [
      {
        "url": "https://megaplay.buzz/stream/s-2/89776/sub",
        "isM3U8": false,
        "quality": "auto"
      }
    ],
    "subtitles": [],
    "malID": 47194
  }
}
```

---

### GET Search Results
**Endpoint:** `/api/v2/hianime/search?q={query}&page={page}`

---

### GET Category Animes
**Endpoint:** `/api/v2/hianime/category/{categoryName}`
**Categories:** `top-airing`, `top-upcoming`, `completed`, `recently-added`

---

### GET Genre Animes
**Endpoint:** `/api/v2/hianime/genre/{genreName}`
**Example:** `/api/v2/hianime/genre/action`

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.
