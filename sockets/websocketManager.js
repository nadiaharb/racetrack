
//const raceHandler = require('./raceHandler') // Passing io object and mode to raceHandler

module.exports = function (io) {

    let mode = 'Safe'

    io.on('connection', socket => {
        console.log('User connected to socket')

        // Emit current mode 
        socket.emit('raceModeChange', mode)

        // Handle 'raceModeChange' event 
        socket.on('raceModeChange', newMode => {
            mode = newMode
            io.emit('raceModeChange', newMode)
        })

        // Handle disconnect event
        socket.on('disconnect', () => {
            console.log('User disconnected')
        })
    })
}
