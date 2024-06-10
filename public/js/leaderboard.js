const socket = io('http://localhost:3000')


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
socket.on('startRace', function (incomingRace) {
    try {
        const race = JSON.parse(incomingRace);
        if (race) {
            renderLeaderBoard(race);
            startCountdown(race.duration);
        }
    } catch (error) {
        console.error('Error parsing or handling data:', error);
    }
});


function renderLeaderBoard(race) {
    const leaderboard = document.getElementById('lb-container');
    leaderboard.innerHTML = ''; // Reset just incase
    const sortedParticipants = race.participants.sort((a, b) => a.bestLapTime - b.bestLapTime);
    const raceDiv = document.createElement('div');
    raceDiv.classList.add('race');
    const colorMap = assignColorsToParticipants(race.participants);
    const raceState = document.createElement('div');
    raceState.classList.add('race-state');
    raceState.innerHTML = `
        <h2>Race: ${race.id}</h2>
        <p>Flag State: ${race.flagState}</p>
        <p>Race State: ${race.raceState}</p>
        <p>Time left: ${formatTime(race.duration)}</p>`;
    raceDiv.innerHTML = `
        <div class="lb-entries">
            ${sortedParticipants.map(participant => `
            <div class="racer">
            <li style="background-color: ${colorMap[participant.carNumber]}; border-color: ${colorMap[participant.carNumber]};">${participant.name} - Car Number: ${participant.carNumber} - Fastest Lap: ${formatTimeWithMilliseconds(participant.bestLapTime)}</li>
            <li class="lap-time">Current Lap: ${formatTimeWithMilliseconds(participant.currentLapTime)}</li></div>
            `).join('')}
        </div>
        `;
    leaderboard.appendChild(raceState)
    leaderboard.appendChild(raceDiv);
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

// Load and render race data
socket.on('updateRaceData', function (incomingRace) {
    try {
        const race = JSON.parse(incomingRace);
        if (race) {
            renderLeaderBoard(race);
        }
    } catch (error) {
        console.error('Error parsing or handling data:', error);
    }
});


// Handle case when no races are available
socket.on('displayNone', function () {
    const leaderboard = document.getElementById('lbContainer');
    leaderboard.innerHTML = '<p>No races available</p>';
});