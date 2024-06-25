const http = require('http');
const routes = require('./routes')
const server = http.createServer(routes)
// Socket.IO import
const { Server } = require('socket.io')
// Socket handler definition
const websocketManager = require('./sockets/websocketManager')
// Function to save data state to local "offline" db
const { updateDatabase } = require("./data/database");
// Data methods to init data store and load them from db
const { setDataStore, loadRacesFromDatabase } = require('./data/database');
const dataStore = require('./models/DataStore');
// Set up db and load data.
setDataStore(dataStore);
loadRacesFromDatabase(dataStore);
// Socket.IO admin node package
const { instrument } = require("@socket.io/admin-ui");
const io = new Server(server, { // Keep this line only when removing admin feature
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
        origin: /\.ngrok-free\.app$/,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
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
    console.log(`Default duration of race in current mode (ms): ${process.env.RACE_DURATION}`)
})
// Set up web socket handler by calling the .js
websocketManager(io)

// Logic for handling various except cases to retain data upon app failure.
async function handleExit(signal) {
    console.log(`${signal} received. Closing server gracefully.`);

    try {
        updateDatabase();
    } catch (err) {
        console.error('Error updating database:', err.message);
    }

    const forceCloseTimeout = setTimeout(() => {
        console.log('Force closing');
        process.exit(1);
    }, 2000);

    server.close((err) => {
        clearTimeout(forceCloseTimeout);
        if (err) {
            console.error('Error closing server:', err.message);
            process.exit(1);
        } else {
            console.log('Server closed gracefully.');
            process.exit(0);
        }
    });
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('SIGUSR1', handleExit);
process.on('SIGUSR2', handleExit);

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    handleExit('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    handleExit('unhandledRejection');
});