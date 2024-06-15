const dataStore = require('../models/DataStore')
const Race = require('../models/Race')
const Racer = require('../models/Racer')

function loadData(socket, io) {
    socket.emit('loadData', JSON.stringify(dataStore.races))
}

function deleteRacer(io, deleteRacer) {
    
    const race = dataStore.getRaceById(deleteRacer.raceId)
    const racer = race.getRacerById(parseInt(deleteRacer.racerId))
    dataStore.onParticipantChange(racer,race,'deleteracer')
    race.deleteParticipant(racer.id)
    const updatedRaces = dataStore.getUpcomingRaces()

    if (!dataStore.getInProgressRace()) {
        io.emit('racerDeleted', dataStore.getNextRace())
    }

    io.emit('loadData', JSON.stringify(updatedRaces))

}

function addRace(socket, io, newRace) {
    const race = new Race(newRace.id)
    race.flagState = "Danger"
    dataStore.addRace(race)

    const upcomingRaces = dataStore.getUpcomingRaces()
    io.emit('loadData', JSON.stringify(upcomingRaces))
    socket.emit('addRace', newRace)
    if (!dataStore.getInProgressRace()) {
        socket.emit('loadRaceControl', dataStore.getNextRace());
    }

}

function deleteRace(io, raceId) {

    dataStore.deleteRaceById(raceId)

    const upcomingRaces = dataStore.getUpcomingRaces()
    if (upcomingRaces === null) {
        io.emit('loadData', null)
    } else {
        io.emit('loadData', JSON.stringify(upcomingRaces))
    }
    const inProgressRace = dataStore.getInProgressRace()
    if (!inProgressRace) {
        io.emit('loadRaceControl', dataStore.getNextRace())
    }

}


function addRacer(io, socket, racerData) {
    const racer = new Racer(racerData.racer.carNumber, racerData.racer.name)
    const currentRace = dataStore.getRaceById(parseInt(racerData.raceId))
    if (!currentRace.isNameUnique(racerData.racer.name)) {
        socket.emit('error', { message: 'Racer with this name already exist' })
        return
    }
    if (!currentRace.isCarUnique(parseInt(racerData.racer.carNumber))) {
        socket.emit('error', { message: 'Racer with this car number already exist' })
        return
    }

    try {
        currentRace.addParticipant(racer)

            dataStore.onParticipantChange(racer, currentRace, 'addracer');
      
    } catch (error) {
        socket.emit('error', { message: error.message })
        return
    }


    const upcomingRaces = dataStore.getUpcomingRaces()
    io.emit('loadData', JSON.stringify(upcomingRaces))
    // Logs basically
    // Emit racer added

    const inProgressRace = dataStore.getInProgressRace()
    if (!inProgressRace) {
        io.emit('racerAdded', dataStore.getNextRace())
    }

}

function editRacer(io, editedRacer) {
    const race = dataStore.getRaceById(editedRacer.raceId)
    const racer = race.getRacerById(parseInt(editedRacer.racerId))
    if (!race.isNameUnique(editedRacer.name, racer.id)) {
        io.emit('error', { message: 'Racer with this name already exist' })
        return
    }
    if (!race.isCarUnique(parseInt(editedRacer.carNumber), racer.id)) {
        io.emit('error', { message: 'Racer with this car number already exist' })
        return
    }
    if (editedRacer.carNumber > 8) {
        io.emit('error', { message: `Car's numbers can be from 1 to 8` })
        return
    }
    racer.name = editedRacer.name
    racer.carNumber = editedRacer.carNumber
    
    // Replaced with function call just incase.
    racer.changeCarNumber(editedRacer.carNumber)
    
    const upcomingRaces = dataStore.getUpcomingRaces()
    const inProgressRace = dataStore.getInProgressRace()
    dataStore.onParticipantChange(racer,race, "updateracer")
    if (!inProgressRace) {
        io.emit('racerEdited', dataStore.getNextRace())
    }
    //DONT COMMENT OUT THIS LINE
    io.emit('loadData', JSON.stringify(upcomingRaces))

}

module.exports = {
    loadData, addRace, deleteRace, addRacer, deleteRacer, editRacer

}