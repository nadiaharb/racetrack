const addRaceForm = document.getElementById('addRaceForm')
const loadDataButton = document.getElementById('loadDataButton')
const socket = io()

window.addEventListener('DOMContentLoaded', function () {
    let receptionistKey

    document.body.classList.add('blur-content')

    const modal = document.getElementById('accessKeyModal')
    const accessKeyInput = document.getElementById('accessKeyInput')
    const submitKeyButton = document.getElementById('submitKeyButton')


    const showModal = () => {
        modal.style.display = 'block'
        accessKeyInput.value = ''
        accessKeyInput.focus()
    }


    const hideModal = () => {
        modal.style.display = 'none'
    }

    socket.on('getKey', loadedData => {
        const data = JSON.parse(loadedData)
        receptionistKey = data.RECEPTIONIST_KEY
        showModal()
    })


    const checkAccessKey = () => {
        const enteredKey = accessKeyInput.value
        const correctKey = receptionistKey

        if (enteredKey === correctKey) {
            console.log('Access granted!')
            document.body.classList.remove('blur-content')
            hideModal()
        } else {
            console.log('Access denied!')
            setTimeout(() => {
                showModal()
            }, 500)
        }
    }

    submitKeyButton.addEventListener('click', checkAccessKey)


    accessKeyInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            checkAccessKey()
        }
    })
})



// render race data
function renderRaces(races) {
    const sessionContainer = document.getElementById('sessionContainer');
    sessionContainer.innerHTML = '';
    if (races === null) {
        console.log("No races to display.");
        // window.location.reload()
        return
    }

    races.forEach(race => {
        const raceDiv = document.createElement('div')
        raceDiv.classList.add('race')
        raceDiv.innerHTML = `
        <h2>Race: ${race.id}</h2>
        <p>Flag State: ${race.flagState}</p>
        <p>Race State: ${race.raceState}</p>
        <ul>
    ${race.participants.map(participant => `
        <li>
            <div class="details">${participant.name} - Car Number: ${participant.carNumber}</div>
            <div class="actions">
                ${race.flagState === "Safe" ? '' : `
                    <button type="submit" class="edit-racer-btn" data-race-id="${race.id}" data-participant-id="${participant.id}" data-participant-name="${participant.name}" data-participant-car="${participant.carNumber}">Edit Racer</button>
                    <button type="submit" class="delete-racer-btn" data-race-id="${race.id}" data-participant-id="${participant.id}">Delete Racer</button>
                `}
            </div>
        </li>
    `).join('')}
</ul>
        <button class="add-racer-button" data-race-id="${race.id}"  data-race-flag="${race.flagState}" ${race.flagState === "Safe" ? 'disabled' : ''}>Add Racer</button>
        <div id ="racerForm${race.id}" class="racerFormContainer" style="display: none;">
            <form id="raceForm${race.id}">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <!-- Hidden carNumber input -->
            <div id="carNumberContainer${race.id}" style="display: none;">
                <label for="carNumber">Car Number:</label>
                <input type="text" id="carNumber" name="carNumber">
            </div>
            <!-- Button to show carNumber input -->
            <button type="button" id="assignCarManuallyButton">Assign Car Manually</button>
            <button type="submit">Add Racer</button>
            <button type="button" class="cancelButton" id="cancelButton${race.id}" data-race-flag="${race.flagState}" ${race.flagState === "Safe" ? 'disabled' : ''}>Cancel</button>
            </form>
        </div>
        <br>
        <br>
        <button  class="delete-button" data-race-id="${race.id}" data-race-flag="${race.flagState}" ${race.flagState === "Safe" ? 'disabled' : ''}>Delete Race</button>
        `
        sessionContainer.appendChild(raceDiv)
        // Add event listeners inside the loop
        const dltBtn = raceDiv.querySelector('.delete-button');
        dltBtn.addEventListener('click', deleteRaceHandler);


        // Event listener for "Assign Car Manually" button
        const assignCarManuallyButton = raceDiv.querySelector('#assignCarManuallyButton');
        assignCarManuallyButton.addEventListener('click', function () {

            document.getElementById('carNumberContainer' + race.id).style.display = 'block';
            assignCarManuallyButton.style.display = 'none'
        })

        // Delete Racer button event listeners
        const deleteRacerButtons = raceDiv.querySelectorAll('.delete-racer-btn')
        deleteRacerButtons.forEach(btn => {
            btn.addEventListener('click', function (event) {
                const participantId = btn.dataset.participantId
                console.log(`Delete racer with ID: ${participantId} from race with ID: ${race.id}`)
                deleteRacer(participantId, race.id)
            })
        })

        const editRacerButtons = raceDiv.querySelectorAll('.edit-racer-btn')
        editRacerButtons.forEach(btn => {
            btn.addEventListener('click', function (event) {
                const raceId = btn.dataset.raceId
                const participantId = btn.dataset.participantId
                const name = btn.dataset.participantName
                const car = btn.dataset.participantCar
                console.log(`Edit racer with ID: ${participantId} from race with ID: ${raceId}`)
                editRacer(raceId, participantId, name, car, race.id)
            })
        })
        // Add Racer button event listener
        const addRacerButton = raceDiv.querySelector('.add-racer-button')
        addRacerButton.addEventListener('click', function () {
            showRacerForm(race.id)
        })


    })
}


function deleteRaceHandler(event) {

    const raceId = event.target.dataset.raceId;

    socket.emit('deleteRace', raceId);
}


//add racer
function showRacerForm(raceId) {
    const racerFormContainer = document.getElementById("racerForm" + raceId)
    racerFormContainer.style.display = 'block'
    const racerForm = document.getElementById('raceForm' + raceId)

    racerForm.onsubmit = function (event) {
        event.preventDefault()
        const formData = new FormData(racerForm)
        const carNumber = formData.get('carNumber')
        const name = formData.get('name')
        const newRacer = {
            carNumber: carNumber,
            name: name
        }

        socket.emit('addRacer', { raceId: raceId, racer: newRacer })
        racerFormContainer.style.display = 'none'
        racerForm.reset()
    }

    const cancelButton = document.getElementById('cancelButton' + raceId)
    cancelButton.onclick = function () {
        racerFormContainer.style.display = 'none'
        racerForm.reset()
    }
}

//edit racer
function editRacer(raceId, participantId, name, car, raceId) {
    // Create modal container
    const modalContainer = document.createElement('div')
    modalContainer.id = 'modalContainer'
    modalContainer.classList.add('modal-overlay')

    // Create modal content
    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.innerHTML = `
        <h3>Edit Racer</h3>
        <label for="newName">New Name:</label>
        <input type="text" id="newName" value="${name}">
        <label for="newCarNumber">New Car Number:</label>
        <input type="text" id="newCarNumber" value="${car}">
        <button id="saveEditBtn">Save</button>
        <button id="cancelEditBtn">Cancel</button>
    `

    modalContainer.appendChild(modal)

    // Append modal container to the body
    document.body.appendChild(modalContainer)

    // Handle save and cancel actions
    const saveEditBtn = modal.querySelector('#saveEditBtn')
    const cancelEditBtn = modal.querySelector('#cancelEditBtn')

    saveEditBtn.addEventListener('click', () => {
        const newName = document.getElementById('newName').value
        const newCarNumber = document.getElementById('newCarNumber').value

        const editedRacer = {
            carNumber: newCarNumber,
            name: newName,
            racerId: participantId,
            raceId: raceId
        }
        console.log(editedRacer)
        socket.emit('editRacer', editedRacer)
        modalContainer.remove()
    })

    cancelEditBtn.addEventListener('click', () => {
        // Close modal without saving changes
        modalContainer.remove()
    })
}
// Delete racer
function deleteRacer(racerId, raceId) {
    const deleteRacer = {
        racerId: racerId,
        raceId: raceId
    }

    socket.emit('deleteRacer', deleteRacer)
}

// Add Race FOrm
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
    //console.log(newRace)
    socket.emit('addRace', newRace)
    //sendData('/addRace', newRace)

})

// Load and render race data
socket.on('loadData', function (loadedData) {

    try {
        if (loadedData === null) {

            renderRaces(null)
            return
        }
        const races = JSON.parse(loadedData)
        if (races) {
            renderRaces(races)
            // console.log(document.querySelectorAll(".delete-racer-btn"))
        }
    } catch (error) {
        console.error('Error parsing or handling data:', error)
    }
})

socket.on('raceAdded', function (response) {
    console.log('Race successfully added:', response)
})

//Error
socket.on('error', (data) => {
    alert(data.message)
})

socket.on("raceModeChanged", race => {
    console.log(race)
})



/*
window.addEventListener('DOMContentLoaded', function () {
    let receptionistKey

    document.body.classList.add('blur-content')

    const modal = document.getElementById('accessKeyModal')
    const accessKeyInput = document.getElementById('accessKeyInput')
    const submitKeyButton = document.getElementById('submitKeyButton')

   
    const showModal = () => {
        modal.style.display = 'block'
        accessKeyInput.value = '' 
        accessKeyInput.focus() 
    }

  
    const hideModal = () => {
        modal.style.display = 'none'
    }

    socket.on('getKey', loadedData => {
        const data = JSON.parse(loadedData)
        receptionistKey = data.RECEPTIONIST_KEY
        showModal()
    })

    
    const checkAccessKey = () => {
        const enteredKey = accessKeyInput.value
        const correctKey = receptionistKey

        if (enteredKey === correctKey) {
            console.log('Access granted!')
            document.body.classList.remove('blur-content')
            hideModal()
        } else {
            console.log('Access denied!')
            setTimeout(() => {
                showModal()
            }, 500)
        }
    }

    submitKeyButton.addEventListener('click', checkAccessKey)

   
    accessKeyInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            checkAccessKey()
        }
    })
})
    //////PROMPT
    window.addEventListener('DOMContentLoaded', function () {
    let receptionistKey
    document.body.classList.add('blur-content')
    socket.on('getKey', loadedData => {
        const data = JSON.parse(loadedData)


        receptionistKey = data.RECEPTIONIST_KEY
        promptAccessKey()
    })

    const promptAccessKey = () => {
        const enteredKey = prompt('Please enter the access key:')
        const correctKey = receptionistKey

        if (enteredKey === correctKey) {
            console.log('Access granted!')
            document.body.classList.remove('blur-content')
        } else {
            console.log('Access denied!')
            setTimeout(promptAccessKey, 500)
        }
    }
})
*/
