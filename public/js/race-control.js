const socket = io();

// Add liteners to buttons
// Safe button
document.getElementById('safeBtn').addEventListener('click', () => {
    console.log("clicked")
    socket.emit('raceModeChange', 'Safe')
})
// Hazard button
document.getElementById('hazardBtn').addEventListener('click', () => {
    socket.emit('raceModeChange', 'Hazard')
})
// Danger button
document.getElementById('dangerBtn').addEventListener('click', () => {
    socket.emit('raceModeChange', 'Danger')
})
// Finish button
document.getElementById('finishBtn').addEventListener('click', () => {
    socket.emit('raceModeChange', 'Finish')
})

// Update mode display in safety official interface
socket.on('raceModeChange', mode => {    
    updateModeDisplay(mode)
})
function updateModeDisplay(mode) {
    document.getElementById('modeDisplay').textContent = mode
}