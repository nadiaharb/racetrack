const socket = io()
//const socket = io('http://localhost:3000')
const startBtn = document.getElementById("startBtn")
const raceModeBtns = document.querySelector(".race-mode-container")
const modeDisplay = document.getElementById("modeDisplay")
const startTitle = document.getElementById('start-title')

const finishDiv = document.querySelector(".end-race-container")
const endBtn = document.getElementById('endBtn')
const table = document.querySelector(".table-container")




socket.on('loadRaceControl', race => {

    renderRace(race)
})

socket.on('racerDeleted', (race) => {
    console.log("racer deletr")
    renderRace(race)
})
socket.on('racerAdded', (race) => {
    console.log("racer added", race)
    renderRace(race)
})

socket.on('racerEdited', (race) => {
    console.log("racer edited")
    renderRace(race)
})

socket.on('raceStarted', (race) => {
    console.log("started", race)
    renderRace(race)
    //renderModeBtns(race)
})

function renderRace(race) {

    if (race === null) {
        table.style.display = 'none'
        startBtn.style.display = 'none'
        raceModeBtns.style.display = 'none'
        startTitle.innerHTML = "No Upcoming Races"
        finishDiv.style.display = 'none'

        return
    }
    if (race.flagState === "Finish") {
        raceModeBtns.style.display = 'none'

        finishDiv.style.display = 'block'
        endBtn.style.backgroundColor = 'red'
        return
    }
    deleteModeButtons()
    createModeButtons()


    endBtn.setAttribute('raceId', race.id)
    startBtn.setAttribute('raceId', race.id)
    startBtn.setAttribute('racers', race.participants.length)
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
    } else {

        startBtn.style.display = 'inline'
        raceModeBtns.style.display = 'none'
        //modeDisplay.innerHTML=race.flagState
        startTitle.innerHTML = "Start Race"
        finishDiv.style.display = 'none'
        table.style.display = 'block'


    }
    const modeBtns = document.querySelectorAll('.modeBtn')
    modeBtns.forEach(btn => {

        btn.addEventListener('click', function (e) {
            e.preventDefault()
            const state = this.getAttribute('data-state')
            if (state === "Finish") {

                //deleteModeButtons()
                finishDiv.style.display = 'block'
                const updateRace = {
                    raceId: race.id,
                    flagState: state
                }
                socket.emit('raceModeChange', updateRace)
                return
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

    startBtn.style.display = 'none'
    raceModeBtns.style.display = 'block'
    modeDisplay.innerHTML = race.flagState
    startTitle.innerHTML = race.raceState



}

startBtn.addEventListener('click', function (e) {
    e.preventDefault()

    const raceIdBtn = startBtn.getAttribute('raceId')
    const racers = startBtn.getAttribute('racers')
    console.log(racers)
    if (parseInt(racers) < 8) {
        console.log("alert")
        alert(`Insufficient number of racers registered to start the race`)
        return
    }
    const modeBtns = document.querySelectorAll('.modeBtn')
    modeBtns.forEach(btn => {
        btn.disabled = false;
        btn.style.backgroundColor = ''
    })

    endBtn.style.backgroundColor = ''

    finishDiv.style.display = 'none';
    raceModeBtns.style.display = 'block'
    modeDisplay.innerHTML = "Safe"
    const updatedMode = {
        flagState: "Safe",
        raceId: raceIdBtn
    }

    socket.emit("startCountdown")
    socket.emit("startedRace", updatedMode)
})




endBtn.addEventListener('click', function (e) {
    e.preventDefault()

    const raceIdBtn = endBtn.getAttribute('raceId')

    const updateRace = {
        raceId: raceIdBtn,
        flagState: "Danger"

    }


    socket.emit('endRace', updateRace)
})


function createModeButtons() {
    const modeBtnsContainer = document.querySelector('.race-mode-container')

    const modes = ['Safe', 'Hazard', 'Danger', 'Finish']

    modes.forEach(mode => {
        const btn = document.createElement('button')
        btn.textContent = mode
        btn.setAttribute('data-state', mode)
        btn.classList.add('modeBtn')
        btn.id = mode.toLowerCase() + 'Btn' // Assigning unique id

        modeBtnsContainer.appendChild(btn)
    })
    const finishBtn = document.getElementById('finishBtn')
    finishBtn.addEventListener('click', function (e) {
        socket.emit('raceFinished');
    });
}

function deleteModeButtons() {
    const modeBtns = document.querySelectorAll('.modeBtn')

    modeBtns.forEach(btn => {
        btn.parentNode.removeChild(btn)
    })
}


