const socket = io();



// Update flag display
socket.on('raceModeChange', mode => {    
    document.getElementById('modeDisplay').textContent = mode
})
