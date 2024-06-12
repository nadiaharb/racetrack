
const fs = require('fs')
const path = require('path')


//https://e3f9-176-118-7-17.ngrok-free.app/


module.exports = function (req, res, io) {
    // Add CORS headers
    const origin = req.headers.origin;
    const allowedOrigin = /\.ngrok-free\.app$/;

    if (origin && allowedOrigin.test(new URL(origin).hostname)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Serve static files from the 'public' directory
    let filePath = '.' + req.url
    if (req.method === 'GET') {
        if (filePath === './') {
            filePath = './views/index.html' // Default to index.html in views directory
        } else if (filePath.startsWith('./public/')) {
            // Serve static files from the public directory
            filePath = '.' + req.url
        } else {
            // Serve HTML templates from the views directory
            filePath = './views' + req.url + '.html'
        }

        const extname = String(path.extname(filePath)).toLowerCase()
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
        }

        const contentType = mimeTypes[extname] || 'application/octet-stream'

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code == 'ENOENT') {
                    fs.readFile('./views/404.html', (error, content) => {
                        res.writeHead(404, { 'Content-Type': 'text/html' })
                        res.end(content, 'utf-8')
                    })
                } else {
                    res.writeHead(500)
                    res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n')
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType })
                res.end(content, 'utf-8')
            }
        })
    }


}


/* ROUTES WITH EXPRESS
const express=require('express')
const router=express.Router()
const path=require('path')

//routes to templates
router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'))
})
router.get('/race-control',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','race-control.html'))
})

router.get('/front-desk',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','front-desk.html'))
})

//export
module.exports=router
*/