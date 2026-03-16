

# <p align="center">Hianiz API</p>

<div align="center">
    A free RESTful API serving anime information from <a href="https://hianimez.to" target="_blank">hianimez.to</a>

  <br/>

  <div>
    <a 
      href="https://github.com/solo12345689/hianiz-api/issues/new"
    > 
      Bug report
    </a>
    ·
    <a 
      href="https://github.com/solo12345689/hianiz-api/issues/new"
    >
      Feature request
    </a>
  </div>
</div>

<br/>

<div align="center">

[![codeql](https://img.shields.io/badge/codeql-passing-brightgreen)](#)
[![docker-build](https://img.shields.io/badge/docker--build-passing-brightgreen)](#)
[![test_coverage](https://img.shields.io/badge/test--coverage-100%25-brightgreen)](#)
[![GitHub License](https://img.shields.io/github/license/solo12345689/hianiz-api?logo=github&logoColor=%23959da5&labelColor=%23292e34&color=%2331c754)](LICENSE)

</div>

<div align="center">

[![stars](https://img.shields.io/github/stars/solo12345689/hianiz-api?style=social)](https://github.com/solo12345689/hianiz-api/stargazers)
[![forks](https://img.shields.io/github/forks/solo12345689/hianiz-api?style=social)](https://github.com/solo12345689/hianiz-api/network/members)
[![issues](https://img.shields.io/github/issues/solo12345689/hianiz-api?style=social&logo=github)](https://github.com/solo12345689/hianiz-api/issues?q=is%3Aissue+is%3Aopen+)
[![version](https://img.shields.io/github/v/release/solo12345689/hianiz-api?display_name=release&style=social&logo=github)](https://github.com/solo12345689/hianiz-api/releases/latest)

</div>

> [!IMPORTANT]
>
> 1. There was previously a hosted version of this API for showcasing purposes only, and it was misused; since then, there have been no other hosted versions. It is recommended to deploy your own instance for personal use by customizing the API as you need it to be.
> 2. This API is just an unofficial API for [hianimez.to](https://hianimez.to) and is in no other way officially related to the same.
> 3. The content that this API provides is not mine, nor is it hosted by me. These belong to their respective owners. This API just demonstrates how to build an API that scrapes websites and uses their content.

## Table of Contents

- [Installation](#installation)
    - [Local](#local)
    - [Docker](#docker)
- [Configuration](#️configuration)
    - [Environment Variables](#environment-variables)
- [Host your instance](#host-your-instance)
    - [Vercel](#vercel)
    - [Render](#render)
- [Backend Provider](#backend-provider)
- [Documentation](#documentation)
    - [GET Anime Home Page](#get-anime-home-page)
    - [GET Anime A-Z List](#get-anime-a-z-list)
    - [GET Anime Qtip Info](#get-anime-qtip-info)
    - [GET Anime About Info](#get-anime-about-info)
    - [GET Search Results](#get-search-results)
    - [GET Search Suggestions](#get-search-suggestions)
    - [GET Producer Animes](#get-producer-animes)
    - [GET Genre Animes](#get-genre-animes)
    - [GET Category Animes](#get-category-animes)
    - [GET Estimated Schedules](#get-estimated-schedules)
    - [GET Anime Episodes](#get-anime-episodes)
    - [GET Anime Next Episode Schedule](#get-anime-next-episode-schedule)
    - [GET Anime Episode Servers](#get-anime-episode-servers)
    - [GET Anime Episode Streaming Links](#get-anime-episode-streaming-links)
- [Development](#development)
- [Contributors](#contributors)
- [Support](#support)
- [License](#license)

## <span id="installation">💻 Installation</span>

### Local

1. Clone the repository and move into the directory.

    ```bash
    git clone https://github.com/solo12345689/hianiz-api.git
    cd hianiz-api
    ```

2. Install all the dependencies.

    ```bash
    npm i
    ```

3. Start the server!

    ```bash
    npm start
    ```

    Now the server should be running on [http://localhost:4000](http://localhost:4000)

### Docker

Run the following commands to build and run the docker image.

```bash
docker build -t hianiz-api .
docker run -d --name hianiz-api -p 4000:4000 hianiz-api
```

## <span id="configuration">⚙️ Configuration</span>

### Environment Variables

- `PORT`: Port number of the API.
- `HIANIME_BACKEND_URL`: Backend URL for anime data.

## <span id="host-your-instance">⛅ Host your instance</span>

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/solo12345689/hianiz-api)

### Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/solo12345689/hianiz-api)

## <span id="backend-provider">📡 Backend Provider</span>

This API utilizes a high-performance backend to scrape and serve anime data.

- **Base URL**: `https://api.hianime.bar/api`
- **Target Site**: `https://hianimez.to`

---

## <span id="documentation">📚 Documentation</span>

The endpoints exposed by the api are listed below with examples that uses the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

<details>

<summary>

### `GET` Anime Home Page

</summary>

#### Endpoint

```bash
/api/v2/hianime/home
```

#### Request Sample

```javascript
const resp = await fetch("http://localhost:4000/api/v2/hianime/home");
const data = await resp.json();
console.log(data);
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `GET` Anime A-Z List

</summary>

#### Endpoint

```sh
/api/v2/hianime/azlist/{sortOption}?page={page}
```

#### Path Parameters

|  Parameter   |  Type  |                                             Description                                             | Required? | Default |
| :----------: | :----: | :-------------------------------------------------------------------------------------------------: | :-------: | :-----: |
| `sortOption` | string | The az-list sort option. Possible values include: "all", "#", "0-9", "other" and A-Z alphabets. |    Yes    |   --    |

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `GET` Anime Qtip Info

</summary>

#### Endpoint

```sh
/api/v2/hianime/qtip/{animeId}
```

#### Request Sample

```javascript
const resp = await fetch("http://localhost:4000/api/v2/hianime/qtip/one-piece-100");
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `GET` Anime About Info

</summary>

#### Endpoint

```sh
/api/v2/hianime/anime/about/{animeId}
```

#### Request Sample

```javascript
const resp = await fetch("http://localhost:4000/api/v2/hianime/anime/about/one-piece-100");
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `GET` Search Results

</summary>

#### Endpoint

```sh
/api/v2/hianime/search?q={query}&page={page}
```

#### Request Sample

```javascript
const resp = await fetch("http://localhost:4000/api/v2/hianime/search?q=one+piece&page=1");
const data = await resp.json();
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `GET` Search Suggestions

</summary>

#### Endpoint

```sh
/api/v2/hianime/search/suggestion?q={query}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `GET` Producer Animes

</summary>

#### Endpoint

```sh
/api/v2/hianime/producer/{name}?page={page}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `GET` Genre Animes

</summary>

#### Endpoint

```sh
/api/v2/hianime/genre/{name}?page={page}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `GET` Category Animes

</summary>

#### Endpoint

```sh
/api/v2/hianime/category/{name}?page={page}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `GET` Estimated Schedules

</summary>

#### Endpoint

```sh
/api/v2/hianime/schedule?date={yyyy-mm-dd}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `GET` Anime Episodes

</summary>

#### Endpoint

```sh
/api/v2/hianime/anime/{animeId}/episodes
```

#### Request Sample

```javascript
const resp = await fetch("http://localhost:4000/api/v2/hianime/anime/steinsgate-9ve6br/episodes");
const data = await resp.json();
```

#### Response Schema

```javascript
{
  "success": true,
  "data": {
    "totalEpisodes": 24,
    "episodes": [
      {
        "number": 1,
        "title": "Turning Point",
        "episodeId": "steinsgate-9ve6br?ep=89776",
        "isFiller": false
      }
    ]
  }
}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `GET` Anime Next Episode Schedule

</summary>

#### Endpoint

```sh
/api/v2/hianime/anime/{animeId}/next-episode-schedule
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `GET` Anime Episode Servers

</summary>

#### Endpoint

```sh
/api/v2/hianime/episode/servers?animeEpisodeId={id}
```

#### Request Sample

```javascript
const resp = await fetch("http://localhost:4000/api/v2/hianime/episode/servers?animeEpisodeId=steinsgate-0-wog7p8?ep=89776");
const data = await resp.json();
```

#### Response Schema

```javascript
{
  "success": true,
  "data": {
    "episodeId": "steinsgate-0-wog7p8?ep=89776",
    "episodeNo": 5,
    "sub": [
      {
        "serverId": 1,
        "serverName": "s-2",
        "streamId": "89776"
      }
    ]
  }
}
```

> [!TIP]
> The `streamId` (e.g., `89776`) is the exact **Hianime Episode ID** required by the [MegaPlay Video API](https://megaplay.buzz/api) to play or embed the video player.

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `GET` Anime Episode Streaming Links

</summary>

#### Endpoint

```sh
/api/v2/hianime/episode/sources?animeEpisodeId={id}&server={server}&category={sub|dub|raw}
```

#### Request Sample

```javascript
const resp = await fetch("http://localhost:4000/api/v2/hianime/episode/sources?animeEpisodeId=steinsgate-9ve6br?ep=89776&server=s-2&category=sub");
const data = await resp.json();
```

#### Response Schema

```javascript
{
  "success": true,
  "data": {
    "headers": {
      "Referer": "https://megaplay.buzz/",
      "User-Agent": "Mozilla/5.0..."
    },
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

[🔼 Back to Top](#table-of-contents)

</details>

## <span id="development">👨💻 Development</span>

Pull requests and stars are always welcome.

## <span id="contributors">✨ Contributors</span>

[![](https://contrib.rocks/image?repo=solo12345689/hianiz-api)](https://github.com/solo12345689/hianiz-api/graphs/contributors)


## <span id="support">🙌 Support</span>

Don't forget to leave a star 🌟.

## <span id="license">📜 License</span>

MIT License.
