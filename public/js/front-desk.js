const socket = io()


function updateModeDisplay(mode) {
    document.getElementById('modeDisplay').textContent = mode
}


socket.on('raceModeChange', mode => {
    // Update mode display
    updateModeDisplay(mode)
})