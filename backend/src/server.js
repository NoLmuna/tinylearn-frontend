/* eslint-disable no-undef */
require('dotenv').config();
const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`🚀 TinyLearn API server running on http://localhost:${port}`);
    console.log(`📋 Health check: http://localhost:${port}/api/health`);
});