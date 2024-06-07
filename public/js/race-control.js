const socket = io();

// Add liteners to buttons
// Safe button
document.getElementById('safeBtn').addEventListener('click', () => {
    console.log("Clicked on Safe")
    socket.emit('raceModeChange', 'Safe')
})
// Hazard button
document.getElementById('hazardBtn').addEventListener('click', () => {
    console.log("Clicked on Hazard")
    socket.emit('raceModeChange', 'Hazard')
})
// Danger button
document.getElementById('dangerBtn').addEventListener('click', () => {
    console.log("Clicked on Danger")
    socket.emit('raceModeChange', 'Danger')
})
// Finish button
document.getElementById('finishBtn').addEventListener('click', () => {
    let text = "Confirm finishing the race";
    if (confirm(text) == true) {
        console.log("Race is finished by safety official")    
        socket.emit('raceModeChange', 'Finish')  
    } else {
        console.log("Finish cancelled")
    }    
})

// Update mode display in safety official interface
socket.on('raceModeChange', mode => {    
    updateModeDisplay(mode)
})
function updateModeDisplay(mode) {
    document.getElementById('modeDisplay').textContent = mode
}