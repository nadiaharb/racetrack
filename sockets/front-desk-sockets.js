const dataStore = require('../models/DataStore')
const Race = require('../models/Race')
const Racer = require('../models/Racer')

function loadData(socket, io) {
    socket.emit('loadData', JSON.stringify(dataStore.races))
}

function addRace(socket, io, newRace) {
    const addRace = new Race(newRace.id)
    addRace.flagState = newRace.flagState
    addRace.raceState = newRace.raceState

    dataStore.addRace(addRace)

    const upcomingRaces = dataStore.getRacesByRaceByState('Upcoming')
    io.emit('loadData', JSON.stringify(upcomingRaces))
    socket.emit('raceAdded', newRace)
}

function deleteRace(socket, io, raceId) {
    // console.log("GOT ID", raceId)
    dataStore.deleteRaceById(raceId)
    //console.log(dataStore.races)
    const upcomingRaces = dataStore.getRacesByRaceByState('Upcoming')
    io.emit('loadData', JSON.stringify(upcomingRaces))
}


function addRacer(socket, io, racerData) {
    const addRacer = racerData.racer

    const newRacer = new Racer(addRacer.carNumber, addRacer.name)
    const currentRace = dataStore.getRaceById(racerData.raceId)
    currentRace.addParticipant(newRacer)


    socket.emit('loadData', JSON.stringify(dataStore.races))

}

module.exports = { loadData, addRace, deleteRace, addRacer }