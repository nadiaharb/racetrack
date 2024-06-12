const socket = io('http://localhost:3000')

let colorMap = {};
/*
Cars can still cross the lap line when the race is in finish mode. 
The observer's display should show a message to indicate that the race session is ended once that has been declared by the Safety Official.

// Apply reset on race end
The buttons must not function after the race is ended. They should disappear or be visually disabled.
*/
/*document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:3000')
    // Init statement

})*/

window.addEventListener('DOMContentLoaded', function () {
    let observerKey
    document.body.classList.add('blur-content')
    socket.on('getKey', loadedData => {
        const data = JSON.parse(loadedData)


        observerKey = data.OBSERVER_KEY
        promptAccessKey()
    })

    const promptAccessKey = () => {
        const enteredKey = prompt('Please enter the access key:')
        const correctKey = observerKey

        if (enteredKey === correctKey) {
            console.log('Access granted!')
            document.body.classList.remove('blur-content')
        } else {
            console.log('Access denied!')
            setTimeout(promptAccessKey, 500)
        }
    }
})



// TO-DO: If page is CTRL+F5 the dynamic lap counters break. Oops.
function renderObserverView(race) {
    const tracker = document.getElementById('tracker-container');
    const mainContainer = document.getElementById('tracker-master-container');
    tracker.innerHTML = ''; // Reset just in case
    mainContainer.innerHTML = ''; // Reset the main container

    const raceState = document.createElement('div');
    raceState.classList.add('race-state');
    raceState.innerHTML = `
        <p id="flagState">Flag State: ${race.flagState}</p>
        <p id="raceState">Race State: ${race.raceState}</p>
        <p id="timeLeft">Time left: ${formatTime(race.duration)}</p>
    `;
    mainContainer.appendChild(raceState);

    colorMap = assignColorsToParticipants(race.participants);

    race.participants.forEach(participant => {
        const racerDiv = document.createElement('div');
        racerDiv.classList.add('lap-counter');
        racerDiv.style.borderColor = colorMap[participant.carNumber];
        racerDiv.innerHTML = `
            <li class="currentLap" data-racer-id="${participant.id}">Current Lap: ${formatTimeWithMilliseconds(participant.currentLapTime)}</li>
            <li class="lapCount" data-racer-id="${participant.id}">Lap Count: ${participant.lapCount}</li>
            <button class="elapse-lap-button" data-racer-id="${participant.id}" data-race-id="${race.id}" style="background-color: ${colorMap[participant.carNumber]}">Elapse ${participant.carNumber}</button>
        `;
        tracker.appendChild(racerDiv);

        const elapseLapBtn = racerDiv.querySelector('.elapse-lap-button');
        // Add event listener
        elapseLapBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const participantId = this.getAttribute('data-racer-id');
            const raceId = this.getAttribute('data-race-id');
            socket.emit('elapseLap', participantId, raceId);
        });
    });
}

function updateObserverView(race) {
    updateRaceStatePanel(race);

    // Update participants information
    race.participants.forEach(participant => {
        const currentLapElem = document.querySelector(`.currentLap[data-racer-id="${participant.id}"]`);
        const lapCountElem = document.querySelector(`.lapCount[data-racer-id="${participant.id}"]`);

        if (currentLapElem) currentLapElem.textContent = `Current Lap: ${formatTimeWithMilliseconds(participant.currentLapTime)}`;
        if (lapCountElem) lapCountElem.textContent = `Lap Count: ${participant.lapCount}`;
    });
}

function updateRaceStatePanel(race) {
    const flagStateElem = document.getElementById('flagState');
    const raceStateElem = document.getElementById('raceState');
    const timeLeftElem = document.getElementById('timeLeft');

    if (flagStateElem) flagStateElem.textContent = `Flag State: ${race.flagState}`;
    if (raceStateElem) raceStateElem.textContent = `Race State: ${race.raceState}`;
    if (timeLeftElem) timeLeftElem.textContent = `Time left: ${formatTime(race.duration)}`;
}

function updateParticipantLap(updatedParticipant) {
    const currentLapElem = document.querySelector(`.currentLap[data-racer-id="${updatedParticipant.id}"]`);
    const lapCountElem = document.querySelector(`.lapCount[data-racer-id="${updatedParticipant.id}"]`);
    if (currentLapElem) currentLapElem.textContent = `Current Lap: ${formatTimeWithMilliseconds(updatedParticipant.currentLapTime)}`;
    if (lapCountElem) lapCountElem.textContent = `Lap Count: ${updatedParticipant.lapCount}`;
}

function updateRaceTime(remainingTime) {
    const timeLeftElem = document.getElementById('timeLeft');
    if (timeLeftElem) {
        timeLeftElem.textContent = `Time left: ${formatTime(remainingTime)}`;
    }
}


socket.on('disableInput', function (incomingRace) {
    try {
        const race = JSON.parse(incomingRace);
        if (race) {
            //enableButtons();
        }
    } catch (error) {
        console.error('Error parsing or handling data:', error);
    }
});

socket.on('updateRaceData', function (incomingRace) {
    try {
        const race = JSON.parse(incomingRace)
        if (race) {
            renderObserverView(race)
        }
    } catch (error) {
        console.error('Error parsing or handling data:', error)
    }
})

socket.on('updateObserver', function (incomingRace) {
    try {
        const race = JSON.parse(incomingRace)
        if (race) {
            updateObserverView(race)
            enableButtons();
        }
    } catch (error) {
        console.error('Error parsing or handling data:', error)
    }
})

socket.on('updateRaceStatePanel', function (incomingRace) {
    try {
        const race = JSON.parse(incomingRace);
        if (race) {
            updateRaceStatePanel(race);
        }
    } catch (error) {
        console.error('Error parsing or handling data:', error);
    }
});

socket.on('lapTimeUpdate', function (incomingParticipants) {
    try {
        const participants = JSON.parse(incomingParticipants);
        if (participants) {
            participants.forEach(p => updateParticipantLap(p));

        }
    } catch (error) {
        console.error('Error parsing or handling data:', error);
    }
});

socket.on('raceTimeUpdate', function (incomingRaceDuration) {
    try {
        const raceDuration = JSON.parse(incomingRaceDuration);
        if (raceDuration) {
            updateRaceTime(raceDuration)

        }
    } catch (error) {
        console.error('Error parsing or handling data:', error);
    }
});

// Handle case when no races are available
socket.on('displayNone', function () {
    displayNone()
});

function displayNone() {
    const tracker = document.getElementById('tracker-container');
    tracker.innerHTML = '<p>No races available</p>';
    tracker.style.display = 'flex';
    tracker.style.justifyContent = 'center';
    tracker.style.textAlign = 'center';
}

socket.on('raceFinished', function () {
    showRaceEndMessage();
    disableButtons();
});


function showRaceEndMessage() {
    // Create the modal container
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.padding = '20px';
    modal.style.backgroundColor = '#fff';
    modal.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    modal.style.zIndex = '1000';
    modal.style.textAlign = 'center';
    modal.style.borderRadius = '10px';
    modal.style.width = '80%';
    modal.style.maxWidth = '300px';

    // Create the message text
    const message = document.createElement('p');
    message.textContent = 'The race has ended!';
    message.style.fontSize = '20px';
    message.style.marginBottom = '20px';
    modal.appendChild(message);

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#007bff';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => document.body.removeChild(modal);
    modal.appendChild(closeButton);

    // Append the modal to the body
    document.body.appendChild(modal);
}

// Helper function to format time in MM:SS
function formatTime(duration) {
    const durationInt = parseInt(duration);
    const minutes = Math.floor(durationInt / 60000);
    const seconds = Math.floor((durationInt % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function formatTimeWithMilliseconds(duration) {
    const durationInt = parseInt(duration, 10);
    const minutes = Math.floor(durationInt / 60000);
    const seconds = Math.floor((durationInt % 60000) / 1000);
    const milliseconds = durationInt % 1000;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${milliseconds}`;
}


function disableButtons() {
    document.querySelectorAll('.elapse-lap-button').forEach(button => {
        button.disabled = true;
        button.style.backgroundColor = '#BEBEBE';
    });
}

function enableButtons() {
    document.querySelectorAll('.elapse-lap-button').forEach((button, index) => {
        button.disabled = false;
        const racerId = button.getAttribute('data-racer-id');
        button.style.backgroundColor = colorMap[racerId] || generateColor(index);
    });
}


function generateColor(index) {
    const hue = index * 137.5 % 360; // Use a golden ratio to distribute colors
    return `hsl(${hue}, 100%, 50%)`;
}

function assignColorsToParticipants(participants) {
    return participants.reduce((acc, participant, index) => {
        acc[participant.carNumber] = generateColor(index);
        return acc;
    }, {});
}