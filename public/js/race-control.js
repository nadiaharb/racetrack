const socket = io();
const startBtn = document.getElementById("startBtn")
const raceModeBtns = document.querySelector(".race-mode-container")
const modeDisplay = document.getElementById("modeDisplay")
const startTitle = document.getElementById('start-title')
const modeBtns = document.querySelectorAll('.modeBtn')
const finishDiv = document.querySelector(".end-race-container")
const endBtn = document.getElementById('endBtn')


// Enable start button
document.getElementById('startBtn').addEventListener('click', startListener)

// Safe button function
function safeListener() {
    console.log("Clicked on Safe")
    socket.emit('raceModeChange', 'Safe')
}
// Hazard button function
function hazardListener() {
    console.log("Clicked on Hazard")
    socket.emit('raceModeChange', 'Hazard')
}
// Danger button function
function dangerListener() {
    console.log("Clicked on Danger")
    socket.emit('raceModeChange', 'Danger')
}
// Finish button function
function finishListener() {
    let text = "Confirm finishing the race";
    if (confirm(text) == true) {
        console.log("Race is finished by safety official")
        socket.emit('raceModeChange', 'Finish')
        document.getElementById('safeBtn').style.backgroundColor = 'gray'
        document.getElementById('hazardBtn').style.backgroundColor = 'gray'
        document.getElementById('dangerBtn').style.backgroundColor = 'gray'
        document.getElementById('finishBtn').style.backgroundColor = 'gray'
        document.getElementById('endBtn').style.backgroundColor = 'orange'

        document.getElementById('safeBtn').removeEventListener('click', safeListener)
        document.getElementById('hazardBtn').removeEventListener('click', hazardListener)
        document.getElementById('dangerBtn').removeEventListener('click', dangerListener)
        document.getElementById('finishBtn').removeEventListener('click', finishListener)
        document.getElementById('endBtn').addEventListener('click', endListener)
    } else {
        console.log("Finish cancelled")
    }
}
// End race button function
function endListener() {
    let text = "Confirm all cars have returned to pit area";
    if (confirm(text)) {
        console.log("Track is declared clear")
        socket.emit('raceModeChange', 'Danger')
        socket.emit('raceEnded')
        document.getElementById('endBtn').removeEventListener('click', endListener)
        document.getElementById('endBtn').style.backgroundColor = 'green'
        document.getElementById('startBtn').style.backgroundColor = 'lightgreen'
        document.getElementById('table-title').innerText = 'Drivers of next race'
        //updateDrivers()
        socket.emit('prepareNextRace', null)
        document.getElementById('startBtn').addEventListener('click', startListener)
    } else {
        console.log("Race end cancelled")
    }
}
// Start race button function
function startListener() {
    let text = "Confirm all cars are ready to start";
    if (confirm(text)) {
        console.log("Race is started")
        socket.emit('raceModeChange', 'Safe')
        document.getElementById('startBtn').removeEventListener('click', startListener)
        document.getElementById('endBtn').style.backgroundColor = 'gray'
        document.getElementById('startBtn').style.backgroundColor = 'gray'
        document.getElementById('safeBtn').style.backgroundColor = 'green'
        document.getElementById('hazardBtn').style.backgroundColor = 'yellow'
        document.getElementById('dangerBtn').style.backgroundColor = 'red'
        document.getElementById('finishBtn').style.backgroundColor = 'white'
        document.getElementById('table-title').innerText = 'Drivers of ongoing race'

        document.getElementById('safeBtn').addEventListener('click', safeListener)
        document.getElementById('hazardBtn').addEventListener('click', hazardListener)
        document.getElementById('dangerBtn').addEventListener('click', dangerListener)
        document.getElementById('finishBtn').addEventListener('click', finishListener)
    } else {
        console.log("Race start cancelled")
    }
}

// Update mode display in safety official interface
socket.on('raceModeChange', (mode) => {
    document.getElementById('modeDisplay').textContent = mode
})


// Update driver table in safety official interface
// Also needs to be called every time next race is edited in reception
socket.on('prepareNextRace', (driver1, driver2, driver3, driver4, driver5, driver6, driver7, driver8) => {
    console.log('preparation')
    document.getElementById('driver1').innerText = 'driver1'
    document.getElementById('driver2').innerText = driver2
    document.getElementById('driver3').innerText = driver3
    document.getElementById('driver4').innerText = driver4
    document.getElementById('driver5').innerText = driver5
    document.getElementById('driver6').innerText = driver6
    document.getElementById('driver7').innerText = 'driver7'
    document.getElementById('driver8').innerText = driver8
})

///////////////////////////////// race-control-new //////////////////////////////////

socket.on('loadRaceControl', race => {

    renderRace(race)
})

socket.on('racerDeleted', (race) => {
    console.log("Racer deleted")
    renderRace(race)
}) //
socket.on('racerAdded', (race) => {
    console.log("Racer added")
    renderRace(race)
})

socket.on('racerEdited', (race) => {
    console.log("Racer edited")
    renderRace(race)
})

socket.on('raceStarted', (race) => {

    renderModeBtns(race)
})

function renderRace(race) {
    console.log(typeof race)
    endBtn.setAttribute('raceId', race.id);

    for (let i = 1; i <= 8; i++) {
        document.getElementById(`driver${i}`).textContent = ''
    }


    race.participants.forEach(participant => {
        const carNumber = participant.carNumber
        const driverCell = document.getElementById(`driver${carNumber}`)
        if (driverCell) {
            driverCell.textContent = participant.name
        }
    })

    if (race.raceState == "In Progress") {
        renderModeBtns(race)
    }

    startBtn.addEventListener('click', function () {
        raceModeBtns.style.display = 'block'
        modeDisplay.innerHTML = race.flagState
        const updatedMode = {
            flagState: "Safe",
            raceId: race.id
        }

        socket.emit("startedRace", updatedMode)
    })


    modeBtns.forEach(btn => {

        btn.addEventListener('click', function (e) {
            e.preventDefault()
            const state = this.getAttribute('data-state')

            if (state === "Finish") {
                finishDiv.style.display = 'block'
                const updateRace = {
                    raceId: race.id,
                    flagState: state
                }

                socket.emit('raceModeChange', updateRace)

            } else {
                const updateRace = {
                    raceId: race.id,
                    flagState: state
                }

                socket.emit('raceModeChange', updateRace)
            }


        })

    })


}


function renderModeBtns(race) {
    endBtn.setAttribute('raceId', race.id);

    startBtn.style.backgroundColor = 'gray'
    raceModeBtns.style.display = 'block'
    modeDisplay.innerHTML = race.flagState
    startTitle.innerHTML = race.raceState
}