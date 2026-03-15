const axios = require('axios');
require('dotenv').config();

const axiosInstance = axios.create({
    baseURL: process.env.HIANIME_BACKEND_URL || 'https://api.hianime.bar/api',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Referer': 'https://hianimes.se/',
        'Accept': 'application/json, text/plain, */*'
    }
});

module.exports = axiosInstance;
