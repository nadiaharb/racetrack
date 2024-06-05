
/*

//LOADING new Data
socket.on('loadData', loadedData => {
    if (loadedData) {
        const sessionContainer = document.getElementById('sessionContainer')
        const races = JSON.parse(loadedData)
        sessionContainer.innerHTML = '' // Clear existing content

        // Iterate through each race
        races.forEach(race => {
            // Create a div element for each race
            const raceDiv = document.createElement('div')
            raceDiv.classList.add('race')

            // Create HTML content for the race
            raceDiv.innerHTML = `
                <h2>Race: ${race.id}</h2>
                <p>Flag State: ${race.flagState}</p>
                <p>Race State: ${race.raceState}</p>
                <ul>
                    ${race.participants.map(participant => `
                        <li>${participant.name} - Car Number: ${participant.carNumber}</li>
                    `).join('')}
                </ul>
                <button class="delete-button" data-race-id="${race.id}">Delete</button>
            `

            // Append the race div to the session container
            sessionContainer.appendChild(raceDiv)



const deleteButton = raceDiv.querySelector('.delete-button');


deleteButton.addEventListener('click', function() {
  console.log("delete clicked")
    const raceId = this.getAttribute('data-race-id');
      socket.emit('deleteRace', race)
})
        })
    }
})

//LOADING existing Data

window.onload = function() {
    // Establish a Socket.IO connection to the server
   

    // Listen for the 'loadData' event from the server
    socket.on('loadData', function(loadedData) {
        try {
            // Parse the data received from the server
            const races = JSON.parse(loadedData)

            if (races) {
                const sessionContainer = document.getElementById('sessionContainer')

                // Clear existing content
                sessionContainer.innerHTML = ''

                // Iterate through each race
                races.forEach(race => {
                    // Create a div element for each race
                    const raceDiv = document.createElement('div')
                    raceDiv.classList.add('race')

                    // Create HTML content for the race
                    raceDiv.innerHTML = `
                        <h2>Race: ${race.id}</h2>
                        <p>Flag State: ${race.flagState}</p>
                        <p>Race State: ${race.raceState}</p>
                        <ul>
                            ${race.participants.map(participant => `
                                <li>${participant.name} - Car Number: ${participant.carNumber}</li>
                            `).join('')}
                        </ul>
                        <button class="delete-button" data-race-id="${race.id}">Delete</button>
                    `

                    // Append the race div to the session container
                    sessionContainer.appendChild(raceDiv)

                    

const deleteButton = raceDiv.querySelector('.delete-button');


deleteButton.addEventListener('click', function() {
  console.log("delete clicked")
    const raceId = this.getAttribute('data-race-id');
      socket.emit('deleteRace', race)
})
                })
            }
        } catch (error) {
            console.error('Error parsing or handling data:', error)
        }
    })

   

    
}








//////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////


/*
\\\\\\\USING API????????



/////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    fetchData('/loadData')
        .then(loadedData => {
            
            if (loadedData) {
                const sessionContainer = document.getElementById('sessionContainer')
                const races = JSON.parse(loadedData)

                // Iterate through each race
                races.forEach(race => {
                    // Create a div element for each race
                    const raceDiv = document.createElement('div')
                    raceDiv.classList.add('race')

                    // Create HTML content for the race
                    raceDiv.innerHTML = `
                        <h2>${race.name}</h2>
                        <p>Flag State: ${race.flagState}</p>
                        <p>Race State: ${race.raceState}</p>
                        <ul>
                            ${race.participants.map(participant => `
                                <li>${participant.name} - Car Number: ${participant.carNumber}</li>
                            `).join('')}
                        </ul>
                    `

                    // Append the race div to the session container
                    sessionContainer.appendChild(raceDiv)
                })
            }
        })
        .catch(error => {
            console.error('Error:', error)
        })
}




loadDataButton.addEventListener('click', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault()
     fetchData('/loadData')
        .then(loadedData => {
               console.log(loadedData)
        })
        .catch(error =>{
            console.error('Error',error)
        })
    
})
////GET DATA FROM SERVER
function fetchData(url){
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load data')
            }
            return response.text()
        })
        .then(data => {
           
           return data
        })
        .catch(error => {
            console.error('Error:', error)
        })
}
////SEND DATA TO SERVER
function sendData(url, data){
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res =>{
        if(!res.ok){
            throw new Error('Failed to send data')
        }
        console.log("Data successfully sent")
    })
    .catch(error => {
        console.error('Error', error)
    })
    
}
window.onload = function() {
    const socket = io()

    socket.on('connect', () => {
        console.log('Connected to server.')

        // Request data from the server upon connection
        socket.emit('fetchData', '/loadData')
    })

    // Handle server response for fetched data
    socket.on('fetchedData', (loadedData) => {
        if (loadedData) {
            const sessionContainer = document.getElementById('sessionContainer')
            const races = JSON.parse(loadedData)

            // Iterate through each race
            races.forEach(race => {
                // Create a div element for each race
                const raceDiv = document.createElement('div')
                raceDiv.classList.add('race')

                // Create HTML content for the race
                raceDiv.innerHTML = `
                    <h2>${race.name}</h2>
                    <p>Flag State: ${race.flagState}</p>
                    <p>Race State: ${race.raceState}</p>
                    <ul>
                        ${race.participants.map(participant => `
                            <li>${participant.name} - Car Number: ${participant.carNumber}</li>
                        `).join('')}
                    </ul>
                `

                // Append the race div to the session container
                sessionContainer.appendChild(raceDiv)
            })
        }
    })
}

socket.on('raceModeChange', mode => {
    // Update mode display
    updateModeDisplay(mode)
})

//GET DATA USING SOCKET
function  fetchData(url){
    return new Promise((resolve, reject)=> {
        socket.emit('fetchData', url,(data)=> {
            resolve(data)
        })
    })
}
// SEND DATA USING SOCKET
function sendData(url, data) {
    socket.emit('sendData', { url, data })
}


function updateModeDisplay(mode) {
    document.getElementById('modeDisplay').textContent = mode
}





// Event listener for form submission to add a new race
addRaceForm.addEventListener('submit', function(event) {
    event.preventDefault() // Prevent the default form submission behavior

    // Get form data
    const formData = new FormData(addRaceForm)
    const raceName = formData.get('raceName')
    const flagState = formData.get('flagState');
    const raceState = formData.get('raceState');

    const newRace = {
        name: raceName,
        flagState: flagState,
        raceState: raceState
    };

    console.log(newRace);
    sendData('/addRace', newRace);
});

// Event listener for button click to fetch data from the server
loadDataButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    fetchData('/loadData')
        .then(loadedData => {
            console.log(loadedData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
*/