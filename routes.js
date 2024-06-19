const fs = require('fs');
const path = require('path');

module.exports = function (req, res, io) {
    // Add CORS headers
    const origin = req.headers.origin;
    const allowedOrigin = /\.ngrok-free\.app$/;

    if (origin && allowedOrigin.test(new URL(origin).hostname)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight (OPTIONS) requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Serve static files from the 'public' directory
    let filePath = '.' + req.url;
    if (req.method === 'GET') {
        if (filePath === './') {
            filePath = './views/index.html'; // Default to index.html in views directory
        } else if (filePath.startsWith('./public/')) {
            // Serve static files from the public directory
            filePath = '.' + req.url;
        } else {
            // Serve HTML templates from the views directory
            filePath = './views' + req.url + '.html';
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.wav': 'audio/wav',
            '.ico': 'image/x-icon',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.svg': 'application/image/svg+xml'
        };

        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code == 'ENOENT') {
                    // Changed to reroute to index since we don't have a 404.html
                    fs.readFile('./views/index.html', (error, content) => {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    });
                } else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
};