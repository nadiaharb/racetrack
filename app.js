require('./loadKeys');
require('./check-keys');

const http = require('http');
const routes = require('./routes')
const server = http.createServer(routes)
//const { createServer }= require('http')
const { Server } = require('socket.io')
const websocketManager = require('./sockets/websocketManager')
//const server=createServer(app)

// https://admin.socket.io/#/
// Server url = "http://localhost:3000" username = "admin" password = "race"
const { instrument } = require("@socket.io/admin-ui");
const io = new Server(server, { // Keep this line only when removing admin feature
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    }
})
instrument(io, {
    auth: {
        type: "basic",
        username: "admin",
        password: "$2a$12$QNYM2ZQj6tBZYmwhVPPjTOzn0APnyEW3/B7O6r9aKVb1CxAA4Bj/q"    // "race" encrypted with bcrypt
      },
    mode: "development",    // more development features, less emphasis on efficiency and speed
})

// Start server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

websocketManager(io)