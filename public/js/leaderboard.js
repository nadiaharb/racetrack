const socket = io('http://localhost:3000')

let colorMap = {};

// This is used for testing

/*
Spectators must be able to see:

    A list of cars and drivers for the current race session, 
    ordered by fastest lap time.
    The last race session's lap times must be displayed until the next race session is safe to start.
    This enables drivers to see their lap times after the race has ended.
    The fastest lap time for each car.
    The current lap for each car.

*/
// TO-DO
// Evaluate with conditionals properly when the next race should be displayed once Safety Official works partially.
// Add logic for dynamic lap time display once Lap Line Observer is fleshed out
// Conceive and implement last-race scoreboard reset/update once Safety Official has that part worked out.
// Aesthetix

// Load and render race data
/*socket.on('startRace', function (incomingRace) {
    try {
        const race = JSON.parse(incomingRace);
        if (race) {
            renderLeaderBoard(race);
            startCountdown(race.duration);
        }
    } catch (error) {
        console.error('Error parsing or handling data:', error);
    }
});*/

// Update flag display





function renderLeaderBoard(race) {
    const leaderboard = document.getElementById('lb-container');
    leaderboard.innerHTML = ''; // Reset just incase
    const sortedParticipants = race.participants.sort((a, b) => a.bestLapTime - b.bestLapTime);
    const raceDiv = document.createElement('div');
    raceDiv.classList.add('race');
    colorMap = assignColorsToParticipants(race.participants);
    const raceState = document.createElement('div');
    raceState.classList.add('race-state');
    raceState.innerHTML = `
        <h2>Race: ${race.id}</h2>
        <p>Flag State: ${race.flagState}</p>
        <p>Race State: ${race.raceState}</p>
        <p>Time left: ${formatTime(race.duration)}</p>
        <div id="flagContainer" class="flag-container"></div>`;
    raceDiv.innerHTML = `
        <div class="lb-entries">
            ${sortedParticipants.map(participant => `
            <div class="racer">
            <li class="participant-data" data-car-number="${participant.carNumber}" style="background-color: ${colorMap[participant.carNumber]}; border-color: ${colorMap[participant.carNumber]};">${participant.name} - Car Number: ${participant.carNumber} - Fastest Lap: ${formatTimeWithMilliseconds(participant.bestLapTime)}</li>
            <li class="lap-time" data-car-number="${participant.carNumber}">Current Lap: ${formatTimeWithMilliseconds(participant.currentLapTime)}</li>
            </div>
            `).join('')}
        </div>`;
    console.log("Leaderboard rendered")
    leaderboard.appendChild(raceState)
    leaderboard.appendChild(raceDiv);

    // Initialize the checkerboard pattern
    initializeCheckerboard();
    // Update the checkerboard with the initial flag state
    updateCheckerboard(race.flagState);
}

function initializeCheckerboard() {
    const flagContainer = document.getElementById('flagContainer');
    flagContainer.innerHTML = ''; // Clear previous flags

    for (let i = 0; i < 64; i++) {
        const square = document.createElement('div');
        square.classList.add((i % 2 === 0) ? 'white' : 'black');
        flagContainer.appendChild(square);
    }
}

function updateCheckerboard(mode) {
    let color1;
    let color2;

    if (mode === "Safe") {
        color1 = 'green';
        color2 = 'green';
    } else if (mode === "Hazard") {
        color1 = 'yellow';
        color2 = 'yellow';
    } else if (mode === "Danger") {
        color1 = 'red';
        color2 = 'red';
    } else if (mode === "Finish") {
        color1 = 'white';
        color2 = 'black';
    }
    const flagContainer = document.getElementById('flagContainer');
    const squares = flagContainer.children;
    for (let i = 0; i < squares.length; i++) {
        const square = squares[i];
        let newColor;

        if (mode === "Finish") {
            const row = Math.floor(i / 8);
            const col = i % 8;
            newColor = (row % 2 === 0) ? (col % 2 === 0 ? color1 : color2) : (col % 2 === 0 ? color2 : color1);
        } else {
            newColor = (i % 2 === 0) ? color1 : color2;
        }

        if (square.style.backgroundColor !== newColor) {
            square.style.backgroundColor = newColor;
        }
    }
}

// Helper function to format time in MM:SS
function formatTime(duration) {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function formatTimeWithMilliseconds(duration) {
    const durationInt = parseInt(duration, 10);
    const minutes = Math.floor(durationInt / 60000);
    const seconds = Math.floor((durationInt % 60000) / 1000);
    const milliseconds = durationInt % 1000;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${milliseconds}`;
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


// Update flag display
socket.on('raceModeChange', race => {
    const mode = race.flagState;
    let color1;
    let color2;

    if (mode === "Safe") {
        color1 = 'green';
        color2 = 'green';
    } else if (mode === "Hazard") {
        color1 = 'yellow';
        color2 = 'yellow';
    } else if (mode === "Danger") {
        color1 = 'red';
        color2 = 'red';
    } else if (mode === "Finish") {
        color1 = 'white';
        color2 = 'black';
    }


    updateCheckerboard(race.flagState);
});

// Update the dynamic elements of the leaderboard
function updateLeaderBoard(race) {
    const raceStateElem = document.querySelector('.race-state');
    raceStateElem.querySelector('p:nth-child(2)').textContent = `Flag State: ${race.flagState}`;
    raceStateElem.querySelector('p:nth-child(3)').textContent = `Race State: ${race.raceState}`;
    raceStateElem.querySelector('p:nth-child(4)').textContent = `Time left: ${race.raceState === "Finished" ? "00:00" : formatTime(race.duration)}`;

    // Update the flag container
    updateCheckerboard(race.flagState);

    const sortedParticipants = race.participants.sort((a, b) => a.bestLapTime - b.bestLapTime);
    sortedParticipants.forEach(participant => {
        const participantElem = document.querySelector(`li.participant-data[data-car-number="${participant.carNumber}"]`);
        if (participantElem) {
            participantElem.innerHTML = `${participant.name} - Car Number: ${participant.carNumber} - Fastest Lap: ${formatTimeWithMilliseconds(participant.bestLapTime)}`;
        }

        const lapTimeElem = document.querySelector(`li.lap-time[data-car-number="${participant.carNumber}"]`);
        if (lapTimeElem) {
            lapTimeElem.textContent = `Current Lap: ${formatTimeWithMilliseconds(participant.currentLapTime)}`;
        }
    });
}

// Load and render race data
socket.on('renderNextRace', function (incomingRace) {
    try {
        const race = JSON.parse(incomingRace);
        if (race) {
            renderLeaderBoard(race);
        }
    } catch (error) {
        console.error('Error parsing or handling data:', error);
    }
});

socket.on('updateData', function (incomingRace) {
    try {
        const race = JSON.parse(incomingRace);
        if (race) {
            updateLeaderBoard(race);
        }
    } catch (error) {
        console.error('Error parsing or handling data:', error);
    }
});


// Handle case when no races are available
socket.on('displayNone', function () {
    const leaderboard = document.getElementById('lb-container');
    leaderboard.innerHTML = '<p>No races available</p>';
});