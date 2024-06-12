const socket = io()

window.addEventListener('DOMContentLoaded', () => {
    // Request current race data from the server when the page loads
    socket.emit('requestCurrentRaceData')
})

// Update flag display
socket.on('raceModeChange', race => {
    updateFlagDisplay(race.flagState)
})

// Handle the current race data received from the server
socket.on('getRaceData', race => {
    console.log(race)
    if(race===null){
        updateFlagDisplay("Danger")
        return
    }
    const data=JSON.parse(race)
    updateFlagDisplay(data.flagState)
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
            color1 = 'white'
            color2 = 'white'
    }

    let whiteSquares = document.getElementsByClassName("white")
    for (let i = 0; i < whiteSquares.length; i++) {
        whiteSquares[i].style.backgroundColor = color1;
    }
    let blackSquares = document.getElementsByClassName("black")
    for (let i = 0; i < blackSquares.length; i++) {
        blackSquares[i].style.backgroundColor = color2;
    }

    console.log("Updated flag display to: " + mode)
}
