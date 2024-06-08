const dataStore = require('../models/DataStore')
const Race = require('../models/Race')
const Racer = require('../models/Racer')

function loadData(socket, io) {
    socket.emit('loadData', JSON.stringify(dataStore.races))
}

function addRace(socket, io, newRace) {
    const race = new Race(newRace.id)
    console.log(newRace);
    dataStore.addRace(race)

    const upcomingRaces = dataStore.getRacesByRaceByState('Upcoming')
    io.emit('loadData', JSON.stringify(upcomingRaces))
    // Logs basically
    io.emit('racesState', dataStore.races)
}

function deleteRace(io, raceId) {
    // console.log("GOT ID", raceId)
    dataStore.deleteRaceById(raceId)

    //console.log(dataStore.races)
    const upcomingRaces = dataStore.getRacesByRaceByState('Upcoming')
    io.emit('loadData', JSON.stringify(upcomingRaces))
}


function addRacer(io, socket, racerData) {
    const racer = new Racer(racerData.carNumber, racerData.name)
    const currentRace = dataStore.getRaceById(racerData.raceID)
    currentRace.addParticipant(racer)

    const upcomingRaces = dataStore.getRacesByRaceByState('Upcoming')
    io.emit('loadData', JSON.stringify(upcomingRaces))
    // Logs basically
    // Emit racer added
    socket.emit('racerAdded', racer)
    // Emit state too
    socket.emit('raceState', currentRace.participants)

}

module.exports = { loadData, addRace, deleteRace, addRacer }