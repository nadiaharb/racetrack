const socket = io()
const table = document.querySelector(".table-container")
const tableTitle = document.getElementById("table-title")
const driversTable = document.getElementById('drivers-table')
const msg = document.getElementById('additionalMessage')

socket.on('loadData', function (loadedData) {

    try {
        if (loadedData === null) {

            renderRace(null)
            return
        }
        const races = JSON.parse(loadedData)[0]

        if (races && races.participants.length > 0) {
            renderRace(races)

        }
    } catch (error) {
        console.error('Error parsing or handling data:', error)
    }
})

socket.on("showMessage", function (loadedData) {
    if (loadedData != null) {
        msg.innerHTML = "Proceed to the paddock for the next race."
    }
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


function renderRace(race) {

    if (race === null) {
        driversTable.style.display = 'none'
        tableTitle.innerHTML = 'No upcoming races'
        msg.innerHTML = ''
        console.log("No upcoming races")

        return
    }


    tableTitle.innerHTML = 'Next Race Information'
    driversTable.style.display = 'inline'
    msg.innerHTML = ''
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


}

/*
// Refresh button for testing
document.getElementById('refreshBtn').addEventListener('click', () => {
    console.log("clicked")
    socket.emit('nextRaceChange')
})


socket.on('nextRaceChange', race => {    
    const container = document.getElementById('nextRaceContainer')

    let list = 'Next race <br><br>'
    for (let i = 0; i < race.participants.length; i++) {
        list += 'Car ' + race.participants[i].carNumber + ' : ' + race.participants[i].name + '<br>'
    }

    container.innerHTML = JSON.stringify(list)
   
    console.log(JSON.stringify(race.participants))
        
})

*/


