const dataStore = require('../models/DataStore');

const { loadData, addRace, deleteRace, addRacer, getRaceParticipants, deleteRacer, editRacer } = require('./front-desk-sockets');
const { } = require('./leaderboard-sockets');

const { RaceState, FlagState } = require('../models/enums');
const { raceModeChange, raceStarted, raceEnded, prepareNextRace, startRace, endRace} = require('./race-control-sockets');
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

        // Load Data 
        socket.emit('loadData', JSON.stringify(dataStore.getUpcomingRacesByFlag("Danger")))

        // Emit current race if it exists
        emitCurrentRace(io);

        // Add Race
        socket.on('addRace', race => {
            addRace(socket, io, race);
            emitCurrentRace(io); // Notify all clients
        });

        //delete racer
        socket.on('deleteRacer', deletedRacer =>{
            deleteRacer( io,deletedRacer)
        } )
        //edit racer
         socket.on('editRacer', editedRacer => {
            editRacer(io, editedRacer)
        })

        // Add Racer - Receptionist
        socket.on('addRacer', (racerData) => {
            addRacer(io, socket, racerData);
            emitCurrentRace(io); // Notify all clients
        });

        // Delete Race
        socket.on('deleteRace', raceID => {
            deleteRace(io, raceID);
            emitCurrentRace(io); // Notify all clients
        });

        // TO-DO
        socket.on('finishLap', raceID => {
            // Lap Line Observer needs a method for his view
        });

        // Gotta check this works
        socket.on('startRace', () => {
            const race = dataStore.getUpcomingRace();
            if (race) {
                race.setRaceState(RaceState.IN_PROGRESS);
                startCountdown(io, race);
                emitCurrentRace(io); // Notify all clients
            }
        });

        // For testing only
        socket.on('startCountdown', () => {
            const race = dataStore.getUpcomingRace();
            if (race) {
                race.setRaceState(RaceState.IN_PROGRESS);
                startCountdown(io, race);
                emitCurrentRace(io); // Notify all clients
            }
        });

        // TO-DO
        /*
        socket.on('endRace', raceID => {
            const race = dataStore.getInProgressRace(raceID);
            if (race) {
                //race.setRaceState(RaceState.FINISHED);
                emitCurrentRace(io); // Notify all clients
                stopCountdown(io, race);
            }
        });
*/
        // Testing purposes, not sure if necessary
        socket.on('changeRaceState', mode => {
            const race = dataStore.getInProgressRace();
            if (race) {
                race.setRaceState(mode);
                emitCurrentRace(io); // Notify all clients
            }
        });

        // Change current race flagState. Testing purposes.
        socket.on('changeFlagState', mode => {
            const race = dataStore.getInProgressRace();
            if (race) {
                race.setFlagState(mode);
                emitCurrentRace(io); // Notify all clients
            }
        });

        // Race control / Safety official
        // Begin new race
        socket.on('raceStarted', () => { emitCurrentRace })

        // Next race display      
        // For testing
        io.emit('nextRaceChange', null);

        // Refresh next race data
        socket.on('prepareNextRace', race => {
            nextRaceChange(socket, io, race);
        });

        //race control
        const inProgressRace = dataStore.getInProgressRace()
        if (inProgressRace) {
            socket.emit('loadRaceControl', inProgressRace);
        } else {
            
            socket.emit('loadRaceControl', dataStore.getNextRace());
        }
        
        socket.on("raceModeChange", updatedRace=>{
            raceModeChange(io,updatedRace)
           
        })

        socket.on("startedRace", updatedRace=>{
             startRace(io,updatedRace)
        })
        socket.on("endRace", updatedRace=>{
            endRace(io,updatedRace)
        })
    });
};

function emitCurrentRace(io) {
    const inProgressRace = dataStore.getInProgressRace();
    const upcomingRace = dataStore.getUpcomingRaces();
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