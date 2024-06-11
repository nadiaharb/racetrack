const socket = io()
const noRace = document.querySelector('.no-race')
socket.on('startRace', function (incomingRace) {
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


function renderTimer(race) {
     
    const timerContainer = document.getElementById('timer-container')
    if (race.duration === undefined || race.raceState === "Finished") {
        const timerContainer = document.getElementById('timer-container')
        timerContainer.innerHTML = '' // Reset just incase
        noRace.innerHTML = "No race in progress"
        return
    }
    if (race.flagState === 'Finish') {
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
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

// Load and render race data
socket.on('updateRaceData', function (incomingRace) {

    try {
        const race = JSON.parse(incomingRace)
        if (race) {
            renderTimer(race)
        }
    } catch (error) {
        console.error('Error parsing or handling data:', error)
    }
})


