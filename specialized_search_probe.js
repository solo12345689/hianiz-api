const axios = require('axios');
const fs = require('fs');

const axiosInstance = axios.create({
    baseURL: 'https://api.hianime.bar/api',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Referer': 'https://hianimes.se/',
        'Accept': 'application/json, text/plain, */*'
    }
});

async function probe() {
    const query = 'One Piece';
    // We use "One Piece" because it's highly specific and almost certainly first if it works.
    
    const variants = [
        { method: 'GET', url: '/search', params: { q: query } },
        { method: 'GET', url: '/search', params: { keyword: query } },
        { method: 'GET', url: '/anime/search', params: { q: query } },
        { method: 'GET', url: '/anime/search', params: { keyword: query } },
        { method: 'POST', url: '/search', data: { q: query } },
        { method: 'POST', url: '/search', data: { keyword: query } },
        { method: 'GET', url: '/animelist', params: { q: query } },
        { method: 'GET', url: '/animelist', params: { keyword: query } },
        { method: 'GET', url: '/animelist', params: { name: query } },
        { method: 'GET', url: '/animelist', params: { title: query } },
        { method: 'GET', url: '/search/suggestion', params: { q: query } },
        { method: 'GET', url: '/search/suggestion', params: { keyword: query } },
        { method: 'GET', url: '/suggestion', params: { q: query } },
        { method: 'GET', url: '/suggestion', params: { keyword: query } },
        { method: 'POST', url: '/filter', data: { keyword: query } },
        { method: 'POST', url: '/filter', data: { q: query } },
        { method: 'POST', url: '/filter', data: { search: query } },
    ];

    console.log(`Starting specialized probe for "${query}"...`);

    for (const v of variants) {
        try {
            let res;
            if (v.method === 'GET') {
                res = await axiosInstance.get(v.url, { params: v.params });
            } else {
                res = await axiosInstance.post(v.url, v.data);
            }
            
            const list = res.data.animes || res.data.results || res.data.suggestions || res.data.data || [];
            if (Array.isArray(list) && list.length > 0) {
                const firstTitle = list[0].title || list[0].name || list[0].English || 'Unknown';
                const isMatch = firstTitle.toLowerCase().includes(query.toLowerCase());
                console.log(`[${v.method}] ${v.url} (${JSON.stringify(v.params || v.data)}): First result: "${firstTitle}" - Match? ${isMatch}`);
                
                if (isMatch) {
                    console.log(`!!! WORKING ENDPOINT FOUND !!!`);
                    console.log(`Endpoint: ${v.url}`);
                    console.log(`Method: ${v.method}`);
                    console.log(`Params: ${JSON.stringify(v.params || v.data)}`);
                    fs.writeFileSync('FOUND_SEARCH_ENDPOINT.json', JSON.stringify({
                        endpoint: v.url,
                        method: v.method,
                        params: v.params || v.data,
                        firstResult: list[0]
                    }, null, 2));
                    // We don't exit so we can see if multiple work
                }
            } else {
                // console.log(`[${v.method}] ${v.url}: Empty`);
            }
        } catch (e) {
            // console.log(`[${v.method}] ${v.url}: Failed (${e.message})`);
        }
    }
}

probe();
