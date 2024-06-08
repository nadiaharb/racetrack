const dataStore = require('../models/DataStore')
const Race = require('../models/Race')
const Racer = require('../models/Racer')

function loadData(socket, io) {
    socket.emit('loadData', JSON.stringify(dataStore.races))
}

function deleteRacer(io, deleteRacer){
    const race = dataStore.getRaceById(deleteRacer.raceId)
    const racer=race.getRacerById(parseInt(deleteRacer.racerId))
     race.deleteParticipant(racer.id)
   const updatedRaces = dataStore.getUpcomingRaces()
   io.emit('loadData', JSON.stringify(updatedRaces))

 }



function addRace(socket, io, newRace) {
    const race = new Race(newRace.id)
    race.flagState="Danger"
    dataStore.addRace(race)

    const upcomingRaces = dataStore.getUpcomingRaces()
    io.emit('loadData', JSON.stringify(upcomingRaces))
    // Logs basically
    io.emit('racesState', dataStore.races)
}

function deleteRace(io, raceId) {
    // console.log("GOT ID", raceId)
    dataStore.deleteRaceById(raceId)

    //console.log(dataStore.races)
    const upcomingRaces = dataStore.getUpcomingRaces()
    io.emit('loadData', JSON.stringify(upcomingRaces))
}


function addRacer(io, socket, racerData) {
    const racer = new Racer(racerData.racer.carNumber, racerData.racer.name)
    const currentRace = dataStore.getRaceById(parseInt(racerData.raceId))
    currentRace.addParticipant(racer)

    const upcomingRaces = dataStore.getUpcomingRaces()
    io.emit('loadData', JSON.stringify(upcomingRaces))
    // Logs basically
    // Emit racer added
    socket.emit('racerAdded', racer)
    // Emit state too
    socket.emit('raceState', currentRace.participants)

}

function editRacer(io,editedRacer){
    const race = dataStore.getRaceById(editedRacer.raceId)
    const racer=race.getRacerById(parseInt(editedRacer.racerId))
    
     racer.name=editedRacer.name
     racer.carNumber=editedRacer.carNumber
     const upcomingRaces = dataStore.getUpcomingRaces()
        io.emit('loadData', JSON.stringify(upcomingRaces))
    }

module.exports = { loadData, addRace, deleteRace, addRacer , deleteRacer,  editRacer

}