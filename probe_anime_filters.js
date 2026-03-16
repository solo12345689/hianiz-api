const axios = require('axios');
const fs = require('fs');

async function probe() {
    const baseURL = 'https://api.hianime.bar/api/anime';
    const paths = [
        '?title=Summer&genres=Action',
        '?title=Summer&page=2',
        '?genres=Action',
        '?Type=TV'
    ];
    
    for (const p of paths) {
        try {
            console.log(`Probing ${baseURL}${p}...`);
            const response = await axios.get(`${baseURL}${p}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            console.log(`Success ${p}: found ${response.data.animes?.length || 0} items`);
        } catch (error) {
            console.log(`Failed ${p}: ${error.message}`);
        }
    }
}

probe();
