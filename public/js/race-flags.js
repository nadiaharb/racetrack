const socket = io()

// Update flag display
socket.on('updateData', race => {
    const incomingRace = JSON.parse(race)
    if (incomingRace) {
        updateFlagDisplay(incomingRace.flagState)
    } else {
        updateFlagDisplay("Danger")
    }
})

// Handle the current race data received from the server
socket.on('initializeData', race => {
    if (race) {
        const data = JSON.parse(race)
        updateFlagDisplay(data.flagState)
    } else {
        updateFlagDisplay("Danger")
    }
})

function updateFlagDisplay(mode) {
    let color1
    let color2

    switch (mode) {
        case "Safe":
            color1 = 'green'
            color2 = 'green'
            break
        case "Hazard":
            color1 = 'yellow'
            color2 = 'yellow'
            break
        case "Danger":
            color1 = 'red'
            color2 = 'red'
            break
        case "Finish":
            color1 = 'white'
            color2 = 'black'
            break
        default:
            color1 = 'red'
            color2 = 'red'
    }

    let whiteSquares = document.getElementsByClassName("flag-white")
    for (let i = 0; i < whiteSquares.length; i++) {
        whiteSquares[i].style.backgroundColor = color1;
    }
    let blackSquares = document.getElementsByClassName("flag-black")
    for (let i = 0; i < blackSquares.length; i++) {
        blackSquares[i].style.backgroundColor = color2;
    }

    //console.log("Updated flag display to: " + mode)
}

/*window.addEventListener('DOMContentLoaded', () => {
    // Request current race data from the server when the page loads
    socket.emit('requestCurrentRaceData')
})*/