const socket = io();

// Update flag display
socket.on('raceModeChange', race => {
    (console.log(race))
    const mode = race.flagState
    let color1
    let color2

    if (mode == "Safe") {
        color1 = 'green'
        color2 = 'green'
    }
    if (mode == "Hazard") {
        color1 = 'yellow'
        color2 = 'yellow'
    }
    if (mode == "Danger") {
        color1 = 'red'
        color2 = 'red'
    }
    if (mode == "Finish") {
        color1 = 'white'
        color2 = 'black'
    }

    let whiteSquares = document.getElementsByClassName("white");
    for (let i = 0; i < whiteSquares.length; i++) {
        whiteSquares[i].style.backgroundColor = color1;
    }
    let blackSquares = document.getElementsByClassName("black");
    for (let i = 0; i < blackSquares.length; i++) {
        blackSquares[i].style.backgroundColor = color2;
    }

    console.log("Updated flag display to: " + mode)
})
