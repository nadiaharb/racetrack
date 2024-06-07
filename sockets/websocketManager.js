
const dataStore = require('../models/DataStore')

const { loadData, addRace, deleteRace, addRacer, getRaceParticipants } = require('./front-desk-sockets')
const { } = require('./leaderboard-sockets')

const { RaceState, FlagState } = require('../models/enums')



/*
Comment for future usage:
If we want to fetch data, we should emit it (pipe it) through the socket, and receive it
by using the .on method on the same event name.
This is basically how the socket works.
*/
// Stringification is necessary so is JSONification
module.exports = function (io) {


    io.on('connection', socket => {
        console.log('User connected to socket')

        socket.emit('loadData', JSON.stringify(dataStore.races))

        /*if (dataStore.getInProgressRace() !== null && dataStore.races.length !== 0 && dataStore.getInProgressRace().duration !== 0) { // While there is a race in progress
            socket.emit('continueCountDown', JSON.stringify(dataStore.getInProgressRace()))
        }*/
        // Emit current race if it exists
        emitCurrentRace(io);

        socket.on('addRace', race => {
            addRace(socket, io, race)
            emitCurrentRace(io); // Notify all clients
        })
        // Add Racer - Receptionist
        socket.on('addRacer', (racerData) => {
            addRacer(io, socket, racerData)
            emitCurrentRace(io); // Notify all clients
        })
        // Delete Race 
        socket.on('deleteRace', raceID => {
            deleteRace(io, raceID)
            emitCurrentRace(io); // Notify all clients
        })
        // TO-DO
        socket.on('finishLap', raceID => {
            // Lap Line Observer needs a method for his view
        })
        // Gotta check this works
        socket.on('startRace', () => {
            const race = dataStore.getUpcomingRace();
            if (race) {
                race.setRaceState(RaceState.IN_PROGRESS)
                startCountdown(io, race)
                emitCurrentRace(io); // Notify all clients
            }
            // Safety Official should be able to emit to this socket.
        })
        // For testing only
        socket.on('startCountdown', () => {
            const race = dataStore.getUpcomingRace();
            if (race) {
                race.setRaceState(RaceState.IN_PROGRESS)
                startCountdown(io, race)
                emitCurrentRace(io); // Notify all clients
            }
            // Safety Official should be able to emit to this socket.
        }) // TO-DO
        socket.on('endRace', raceID => {
            const race = dataStore.getInProgressRace(raceID);
            if (race) {
                race.setRaceState(RaceState.FINISHED);
                emitCurrentRace(io); // Notify all clients
                stopCountdown(io, race);
            }
            // Safety Official should be able to emit to this socket.
        }) // Testing purposes, not sure if necessary
        socket.on('changeRaceState', mode => {
            const race = dataStore.getInProgressRace()
            if (race) {
                race.setRaceState(mode);
                emitCurrentRace(io); // Notify all clients
            }
        })
        // Change current race flagState. Testing purposes, not sure if necessray.
        socket.on('changeFlagState', mode => {
            //dataStore.getUpcomingRace().setFlagState(mode);
            const race = dataStore.getInProgressRace();
            if (race) {
                race.setFlagState(mode);
                emitCurrentRace(io); // Notify all clients
            }

        })

        // Handle disconnect event
        socket.on('disconnect', () => {
            console.log('User disconnected')
        })
    })
}

function emitCurrentRace(io) {
    const inProgressRace = dataStore.getInProgressRace();
    const upcomingRace = dataStore.getUpcomingRace();
    if (inProgressRace) {
        io.emit('updateRaceData', JSON.stringify(inProgressRace));
    } else if (upcomingRace) {
        io.emit('updateRaceData', JSON.stringify(upcomingRace));
    } else {
        // Gotta make changes here for leaderboard probably
        io.emit('displayNone', {});
    }
}

function startCountdown(io, race) {
    const interval = setInterval(() => {
        if (race.duration > 0 && race.raceState === RaceState.IN_PROGRESS) {
            race.duration -= 1000; // Decrement by 1 second (1000ms)
            io.emit('updateRaceData', JSON.stringify(race)); // Emit to all connected clients
        } else {
            clearInterval(interval);
            if (race.raceState === RaceState.IN_PROGRESS) {
                race.setRaceState(RaceState.FINISHED);
                io.emit('raceStateChange', JSON.stringify(race));
                emitCurrentRace(io); // Notify all clients
            }
        }
    }, 1000); // Countdown interval set to 1 second
}

// Not in use yet, yet to be verified
function stopCountdown(io, race) {
    race.setRaceState(RaceState.FINISHED);
    io.emit('raceStateChange', JSON.stringify(race));
    emitCurrentRace(io); // Notify all clients
}