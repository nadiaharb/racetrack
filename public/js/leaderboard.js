const socket = io('http://localhost:3000')

// This is used for testing
const startCountdownBtn = document.getElementById('startCountdown')

startCountdownBtn.addEventListener('click', function (e) {
    e.preventDefault();

    socket.emit('startCountdown')
})
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
    const leaderboard = document.getElementById('lbContainer');
    leaderboard.innerHTML = ''; // Reset just incase
    const sortedParticipants = race.participants.sort((a, b) => a.bestLapTime - b.bestLapTime);
    const raceDiv = document.createElement('div');
    raceDiv.classList.add('race');
    raceDiv.innerHTML = `
        <h2>Race: ${race.id}</h2>
        <p>Flag State: ${race.flagState}</p>
        <p>Race State: ${race.raceState}</p>
        <p>Time left: ${formatTime(race.duration)}</p>
        <ul>
            ${sortedParticipants.map(participant => `
                <li>${participant.name} - Car Number: ${participant.carNumber} - Fastest Lap: ${participant.bestLapTime}</li>
                <li>Current Lap: ${formatTimeWithMilliseconds(participant.currentLapTime)}</li>
            `).join('')}
        </ul>
        `;
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
    console.log(`Time to be formatted: ${durationInt}`);
    const minutes = Math.floor(durationInt / 60000);
    const seconds = Math.floor((durationInt % 60000) / 1000);
    const milliseconds = durationInt % 1000;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${milliseconds}`;
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