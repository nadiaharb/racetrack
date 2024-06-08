//const { error } = require("loglevel")
//const socket = io()
const addRaceForm = document.getElementById('addRaceForm')
const loadDataButton = document.getElementById('loadDataButton')
const socket = io('http://localhost:3000')

// TO-DO:
// Add ability to Edit/Delete existing racers attached to specific race
// Auto-generate car number in vanilla version, implement current variant in bonus version

// render race data
function renderRaces(races) {
    const sessionContainer = document.getElementById('sessionContainer')
    sessionContainer.innerHTML = ''

    races.forEach(race => {
        const raceDiv = document.createElement('div')
        raceDiv.classList.add('race')
        raceDiv.innerHTML = `
            <h2>Race: ${race.id}</h2>
            <p>Flag State: ${race.flagState}</p>
            <p>Race State: ${race.raceState}</p>
            <ul>
                ${race.participants.map(participant => `
                    <li>${participant.name} - Car Number: ${participant.carNumber}</li>
                `).join('')}
            </ul>
            <button class="add-racer-button" data-race-id="${race.id}">Add Racer</button>
            <div  id ="racerForm${race.id}" class="racerFormContainer" style="display: none;">
            <form id="raceForm${race.id}">
                <label for="carNumber">Car Number:</label>
                <input type="text" id="carNumber" name="carNumber" required>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <button type="submit">Add Racer</button>
                <button type="button" id="cancelButton">Cancel</button>
            </form>
        </div>
        <button class="delete-race-button" data-race-id="${race.id}">Delete</button>
        `
        sessionContainer.appendChild(raceDiv)
        // Add Racer button event listener
        const addRacerButton = raceDiv.querySelector('.add-racer-button')
        addRacerButton.addEventListener('click', function () {
            showRacerForm(race.id)
        })
        const removeRaceButton = raceDiv.querySelector('.delete-race-button')
        removeRaceButton.addEventListener('click', function () {
            socket.emit('deleteRace', JSON.stringify(race.id))
        })



    })
}

//add racer
function showRacerForm(raceID) {
    const racerFormContainer = document.getElementById("racerForm" + raceID)
    racerFormContainer.style.display = 'block'
    const racerForm = document.getElementById('raceForm' + raceID)
    console.log(racerForm)
    racerForm.onsubmit = function (event) {
        event.preventDefault()
        const formData = new FormData(racerForm)
        const carNumber = formData.get('carNumber')
        const name = formData.get('name')
        const racerData = {
            carNumber: carNumber,
            name: name,
            raceID: raceID
        }
        socket.emit('addRacer', racerData)
        racerFormContainer.style.display = 'none'
        racerForm.reset()
    }

    const cancelButton = document.getElementById('cancelButton')
    cancelButton.onclick = function () {
        racerFormContainer.style.display = 'none'
        racerForm.reset()
    }
}


// Load and render race data
socket.on('loadData', function (loadedData) {
    try {
        const races = JSON.parse(loadedData)
        if (races) {
            renderRaces(races)
        }
    } catch (error) {
        console.error('Error parsing or handling data:', error)
    }
})


// Add new race
addRaceForm.addEventListener('submit', function (event) {

    event.preventDefault() // Prevent the default form submission behavior

    // Get form data
    const formData = new FormData(addRaceForm)
    const flagState = formData.get('flagState')
    const raceState = formData.get('raceState')

    const newRace = {
        flagState: flagState,
        raceState: raceState
    }
    console.log(newRace)
    socket.emit('addRace', newRace)
    //sendData('/addRace', newRace)

})


// Buncha logs

socket.on('raceAdded', function (response) {
    console.log('Race successfully added:', response)
})
socket.on('racerAdded', function (response) {
    console.log('Racer successfully added:', response)
})
socket.on('raceState', function (response) {
    console.log('Race state after transaction:', response)
})
socket.on('racesState', function (response) {
    console.log('State of races after transaction:', response)
})

