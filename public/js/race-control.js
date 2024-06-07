const socket = io();

function updateModeDisplay(mode) {
    document.getElementById('modeDisplay').textContent = mode
}

document.getElementById('safeBtn').addEventListener('click', () => {
    console.log("clicked")
    socket.emit('raceModeChange', 'Safe')
})

document.getElementById('hazardBtn').addEventListener('click', () => {
    socket.emit('raceModeChange', 'Hazard')
})

document.getElementById('dangerBtn').addEventListener('click', () => {
    socket.emit('raceModeChange', 'Danger')
})

document.getElementById('finishBtn').addEventListener('click', () => {
    socket.emit('raceModeChange', 'Finish')
})

socket.emit('startRace', race => {
    // Race controller does something and race starts.
})
socket.on('raceModeChange', mode => {

    // Update mode display
    updateModeDisplay(mode)
})