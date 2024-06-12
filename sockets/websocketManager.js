const dataStore = require('../models/DataStore');

const { loadData, addRace, deleteRace, addRacer, getRaceParticipants, deleteRacer, editRacer } = require('./front-desk-sockets');
const { } = require('./leaderboard-sockets');

const { RaceState, FlagState } = require('../models/enums');
const { raceModeChange, raceStarted, raceEnded, prepareNextRace, startRace, endRace } = require('./race-control-sockets');
const { nextRaceChange } = require('./next-race-sockets');


/*
Comment for future usage:
If we want to fetch data, we should emit it (pipe it) through the socket, and receive it
by using the .on method on the same event name.
This is basically how the socket works.
*/
// Stringification is necessary so is JSONification
module.exports = function (io) {
    io.on('connection', socket => {

        console.log('User connected to socket');

        // Handle disconnect event
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
        //env keys
        const keys = {
            RECEPTIONIST_KEY: process.env.RECEPTIONIST_KEY,
            OBSERVER_KEY: process.env.OBSERVER_KEY,
            SAFETY_KEY: process.env.SAFETY_KEY
        }
        socket.emit('getKey', JSON.stringify(keys))
        // Load Data 
        socket.emit('loadData', JSON.stringify(dataStore.getUpcomingRacesByFlag("Danger")))
        const nextRace = dataStore.getNextRace();
        if (nextRace) {
            io.emit('renderNextRace', JSON.stringify(nextRace))
            io.emit('lapTimeUpdate', JSON.stringify(nextRace.pariticipants))
        } else {
            io.emit('displayNone')
        }

        // Emit current race if it exists
        // Used by Leaderboard and Lap-Line Tracker
        emitCurrentRace(io);

        // Race Control INIT
        handleRaceControl(socket);
        // Race Control
        socket.on("raceModeChange", updatedRace => {
            raceModeChange(io, updatedRace)
        })

        socket.on("startedRace", mode => {
            const nextRace = dataStore.getNextRace();
            if (nextRace) {
                //race.setRaceState(RaceState.IN_PROGRESS);
                for (participant of nextRace.participants) {
                    participant.elapseLap();
                }
                startRaceTimerMain(io, nextRace)
                //startCountdown(io, race);
                //startLapTimeUpdate(io, race);
                emitCurrentRace(io); // Notify all clients
            }
            startRace(io, mode)
        })

        socket.on("endRace", updatedRace => {
            //stopCountdown(io, updatedRace);
            endRace(io, updatedRace)
            io.emit('disableInput', updatedRace)
        })

        // This is use until I can figure out why I can't tie logic inside of this to any of the startrace emits
        socket.on('startCountdown', () => {

        });



        // Front Desk

        // Add Race
        socket.on('addRace', race => {
            addRace(socket, io, race);
            emitCurrentRace(io); // Notify all clients
        });

        // Delete Race
        socket.on('deleteRace', raceID => {
            deleteRace(io, raceID);
            emitCurrentRace(io); // Notify all clients
        });

        // Add Racer
        socket.on('addRacer', (racerData) => {
            addRacer(io, socket, racerData);
            emitCurrentRace(io); // Notify all clients
        });

        // Edit Racer
        socket.on('editRacer', editedRacer => {
            editRacer(io, editedRacer)
        })

        // Delete Racer
        socket.on('deleteRacer', deletedRacer => {
            deleteRacer(io, deletedRacer)
        })

        socket.on('elapseLap', (participantID, raceID) => {
            const race = dataStore.getRaceById(parseInt(raceID));
            const participantIDInt = parseInt(participantID)
            if (!race) {
                throw new Error('Race not found!');
            }
            const participant = race.participants.find(r => r.id === participantIDInt);
            if (participant) {
                participant.elapseLap(); // Call elapseLap on the racer
                io.emit('updateObserver', JSON.stringify(race));
                console.log(participant.lapCount)
            } else {
                throw new Error('Participant not found');
            }
        });
        // This state sets state to Finished
        socket.on('raceFinished', () => {
            const inProgressRace = dataStore.getInProgressRace();
            inProgressRace.duration = 0; // Set the duration to 0 so all events stop
            io.emit('raceFinished') // Make sure everybody knows
        })
        // This state clears the race
        socket.on('endRace', () => {
            if (!dataStore.getUpcomingRaces()) {
                io.emit('displayNone');
            }
        })
    });
};

// This is used to transmit the main generic state of the ongoing race, or buffer the incoming race
function emitCurrentRace(io) {
    const inProgressRace = dataStore.getInProgressRace();
    const upcomingRace = dataStore.getNextRace();
    if (inProgressRace) {
        io.emit('updateRaceData', JSON.stringify(inProgressRace));
    } else if (upcomingRace) {
        io.emit('updateRaceData', JSON.stringify(upcomingRace));
    } else {
        // Gotta make changes here for leaderboard probably
        io.emit('displayNone', {});
    }
}

// Consolidate countdown and lap time update logic
function startRaceTimerMain(io, race) {
    // Start the race timer
    race.startRaceTimer(() => {
        emitCurrentRace(io);
    });

    // Update clients with race duration and lap times
    const interval = setInterval(() => {
        if (race.raceState === RaceState.IN_PROGRESS) {
            io.emit('raceTimeUpdate', JSON.stringify(race.duration));
            io.emit('lapTimeUpdate', JSON.stringify(race.participants));
            io.emit('updateObserver', JSON.stringify(race));
            emitCurrentRace(io);
        } else {
            clearInterval(interval);
        }
    }, 100);
    const otherInterval = setInterval(() => {
        if (race.raceState === RaceState.IN_PROGRESS) {
            emitCurrentRace(io)
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

function handleRaceControl(socket) {
    const inProgressRace = dataStore.getInProgressRace()

    if (inProgressRace) {
        socket.emit('loadRaceControl', inProgressRace);
    } else {
        socket.emit('loadRaceControl', dataStore.getNextRace());
    }
}