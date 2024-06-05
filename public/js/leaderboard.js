const socket = io('http://localhost:3000')
// Function to render race data

/*
Spectators must be able to see:

    A list of cars and drivers for the current race session, ordered by fastest lap time.
    A timer showing the remaining time of the race session.
    The last race session's lap times must be displayed until the next race session is safe to start.
    This enables drivers to see their lap times after the race has ended.
    The fastest lap time for each car.
    The current lap for each car.

*/

// Load and render race data
socket.on('loadData', function (loadedData) {
    try {
        const races = JSON.parse(loadedData);
        if (races) {
            renderLeaderBoard(races[0]);
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
        <ul>
            ${sortedParticipants.map(participant => `
                <li>${participant.name} - Car Number: ${participant.carNumber} - Fastest Lap: ${participant.bestLapTime}</li>
            `).join('')}
        </ul>`;
    leaderboard.appendChild(raceDiv);
}
