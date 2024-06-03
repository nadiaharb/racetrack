require('./loadKeys');
require('./check-keys');

const http = require('http');
const routes = require('./routes')
const server = http.createServer(routes)
//const { createServer }= require('http')
const { Server } = require('socket.io')
const websocketManager = require('./sockets/websocketManager')
//const server=createServer(app)






const io = new Server(server)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    //console.log(process.env)

})


websocketManager(io)
//RECEPTIONIST_KEY=8ded6076 OBSERVER_KEY=662e0f6c SAFETY_KEY=a2d393bc npm start
