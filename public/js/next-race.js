
const socket = io('http://localhost:3000')
const race2 = require('../models/DataStore')

function renderRaces(race2) {
    const nextRaceContainer = document.getElementById('nextRaceContainer')
    nextRaceContainer.innerText = ''

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
            <button class="delete-button" data-race-id="${race.id}">Delete</button>
        `
        sessionContainer.appendChild(raceDiv)

    })



    
}


socket.on('raceAdded', function(response) {
    console.log('Race successfully added:', response)
})

