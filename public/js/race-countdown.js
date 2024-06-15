const socket = io()
const noRace = document.querySelector('.no-race')

socket.on('initializeData', race => {

    const data = JSON.parse(race)
    if (data === null) {
        // timerContainer.innerHTML = '' // Reset just incase
        noRace.innerHTML = "No race in progress"
        return
    }
    renderTimer(data)
})

socket.on('updateData', function (incomingRace) {
    if (incomingRace === null) {
        const timerContainer = document.getElementById('timer-container')
        timerContainer.innerHTML = '<p>No races available</p>'
    }
    try {
        const race = JSON.parse(incomingRace)
        if (race) {
            renderTimer(race)
        }
    } catch (error) {
        console.error('Error parsing or handling data:', error)
    }
})

socket.on('displayNone', () => {
    const timerContainer = document.getElementById('timer-container')
    timerContainer.innerHTML = '<p>No races available</p>'
})

function renderTimer(race) {

    const timerContainer = document.getElementById('timer-container')
    if (race.duration === undefined || race.raceState === "Finished") {

        const timerContainer = document.getElementById('timer-container')
        timerContainer.innerHTML = '' // Reset just incase
        noRace.innerHTML = "No race in progress"
        return
    }

    noRace.innerHTML = ""
    timerContainer.innerHTML = '' // Reset just incase
    const raceDiv = document.createElement('div')
    raceDiv.classList.add('race')
    raceDiv.innerHTML = `
        
        <p>Time left: ${formatTime(race.duration)}</p>
      
        `
    timerContainer.appendChild(raceDiv)
}

// Helper function to format time in MM:SS
function formatTime(duration) {
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    if (minutes === -1 || seconds === -1) { // So the time doesn't look weird
        return "0:00"
    }
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

/*
// This code doesn't seem to have a purpose
window.addEventListener('DOMContentLoaded', () => {
    socket.emit('requestCurrentRaceData')
})
*/