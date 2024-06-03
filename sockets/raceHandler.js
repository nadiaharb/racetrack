

// This should be attached to the current race
module.exports = function (socket, mode) {

    socket.emit('raceModeChange', mode)

    // Handle 'raceModeChange' event from client
    socket.on('raceModeChange', newMode => {
        mode = newMode
        io.emit('raceModeChange', newMode)
    })


}
