const dataStore = require('../models/DataStore');
const { RaceState } = require('../models/enums');

const { addRace, deleteRace, addRacer, deleteRacer, editRacer } = require('./front-desk-sockets');
const { raceModeChange, startRace, endRace } = require('./race-control-sockets');
const { raceChange, racerChange, updateRaceParticipants } = require("../data/database")

module.exports = function (io) {
    io.on('connection', socket => {
        console.log('User connected to socket');
        // Emit current race or upcoming race data
        emitCurrentRace(io);


        // Send environment keys
        const keys = {
            RECEPTIONIST_KEY: process.env.RECEPTIONIST_KEY,
            OBSERVER_KEY: process.env.OBSERVER_KEY,
            SAFETY_KEY: process.env.SAFETY_KEY
        };
        socket.emit('getKey', JSON.stringify(keys));

        // Load initial data
        socket.emit('loadData', JSON.stringify(dataStore.getUpcomingRacesByFlag("Danger")));
        const currentRace = dataStore.getInProgressRace()
        const nextR = dataStore.getNextRace()
        if (!currentRace) {
            io.emit('loadRaceControl', nextR)
        } else {
            io.emit('loadRaceControl', currentRace)
        }
        // Make sure app timer is resumed if there is a race in progress
        if (currentRace && currentRace.duration > 0) {
            currentRace.resumeRaceTimer();
            currentRace.participants.forEach(participant => participant.resumeLapTimer()); // Call elapseLap on the racer)
        }
        // If no race in progress, next race exists and has required amount of participants
        if (!currentRace && nextR && nextR.participants.length === 8) {
            // Display msg to direct drivers to paddock.
            io.emit('showMessage', dataStore.getNextRace())
        }

        socket.on('requestCurrentRaceData', () => {
            getRaceData(io);
        });


        // Disable Lap-Line-Observer on-load if no race in progress
        if (!dataStore.getInProgressRace() || dataStore.getInProgressRace().duration === 0) {
            io.emit('disableInput', JSON.stringify(dataStore.getNextRace()));
        }

        // Initialize Race Control
        handleRaceControl(socket);

        // Race Control
        socket.on("raceModeChange", updatedRace => {
            raceModeChange(io, updatedRace);
            if (updatedRace.flagState === "Finish") {
                // Make sure current race duration is set to 0.
                const inProgressRace = dataStore.getInProgressRace();
                inProgressRace.duration = 0; // Set the duration to 0 so all events stop
                inProgressRace.flagState = 'Finish' // correct flagState
                //ADDED CODE TO STOP CURRENT LAP
                const racers = dataStore.getRacersByRaceID(inProgressRace.id)
                racers.forEach(participant => {
                    participant.stopLapTimer()
                });
                //END OF  CODE
                io.emit('disableInput'); // Disable buttons for lap-line-observer
            }

        });

        socket.on("startedRace", mode => {
            const nextRace = dataStore.getNextRace();
            if (nextRace) {
                nextRace.participants.forEach(participant => participant.elapseLap());
                startRaceTimerMain(io, nextRace);
                emitCurrentRace(io);
            }
            startRace(io, mode);
        });
        socket.on('endRace', (updatedRace) => {
            // Refresh all views with upcoming race,replacing old data

            const nextRace = dataStore.getNextRace()
            if (nextRace) {
                io.emit('updateData', JSON.stringify(dataStore.getNextRace()))
            } else {
                io.emit('displayNone'); // Notify lap-line-observer and leaderboard
            }
            endRace(io, updatedRace); // Effectively deletes race
            io.emit('disableInput', updatedRace); // lap-line-observer
        });

        // Front Desk
        socket.on('addRace', race => {
            addRace(socket, io, race);
            emitCurrentRace(io); // Notify all clients
        });

        socket.on('deleteRace', raceID => {
            deleteRace(io, raceID);
            emitCurrentRace(io); // Notify all clients
        });

        socket.on('addRacer', racerData => {
            addRacer(io, socket, racerData);
            emitCurrentRace(io); // Notify all clients
        });

        socket.on('editRacer', editedRacer => {
            editRacer(io, editedRacer);
        });

        socket.on('deleteRacer', deletedRacer => {
            deleteRacer(io, deletedRacer);
        });

        // Lap Line Observer
        socket.on('elapseLap', (participantID, raceID) => {
            const race = dataStore.getRaceById(parseInt(raceID));
            const participantIDInt = parseInt(participantID);
            if (!race) {
                throw new Error('Race not found!');
            }
            const participant = race.participants.find(r => r.id === participantIDInt);
            if (participant) {
                participant.elapseLap(); // Call elapseLap on the racer
            } else {
                throw new Error('Participant not found');
            }
        });
        //STOP CURRENT LAP
        socket.on('notifyTimeEnd', () => {
            let inProgress = dataStore.getInProgressRace()
            console.log()
            if (inProgress && inProgress.flagState === "Finish") {
                inProgress.participants.forEach(participant => {
                    participant.stopLapTimer()
                })

            }

        });
        // Exit events

        // Handle disconnect event
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

    });

    // Model data change detection (extends EventEmitter)
    dataStore.on('notifyChange', () => {
        io.emit('updateData', JSON.stringify(dataStore.getInProgressRace()));
        let inProgress = dataStore.getInProgressRace()
        if (inProgress && inProgress.flagState === "Finish") {
            io.emit("raceModeChange", inProgress) ///getting flagChange when duration ===0
        }
    });

};

// This is used to transmit the main generic state of the ongoing race, or buffer the incoming race
function emitCurrentRace(io) {

    const inProgressRace = dataStore.getInProgressRace();
    //console.log(inProgressRace)
    const upcomingRace = dataStore.getNextRace();
    if (inProgressRace) {
        io.emit('initializeData', JSON.stringify(inProgressRace));
    } else if (upcomingRace) {
        io.emit('initializeData', JSON.stringify(upcomingRace));
    } else {
        io.emit('displayNone', {});
    }
}

// Consolidate countdown and lap time update logic
function startRaceTimerMain(io, race) {
    race.startRaceTimer(() => {
        emitCurrentRace(io);
    });
}

function handleRaceControl(socket) {
    const inProgressRace = dataStore.getInProgressRace();
    if (inProgressRace) {
        socket.emit('loadRaceControl', inProgressRace);
    } else {
        socket.emit('loadRaceControl', dataStore.getNextRace());
    }
}

function getRaceData(io) {
    const inProgressRace = dataStore.getInProgressRace();
    const upcomingRace = dataStore.getNextRace();
    if (inProgressRace) {
        io.emit('getRaceData', JSON.stringify(inProgressRace));
    } else if (upcomingRace) {
        io.emit('getRaceData', JSON.stringify(upcomingRace));
    } else {
        io.emit('getRaceData', null);
    }
}