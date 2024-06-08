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
   io.emit('racerDeleted', dataStore.getNextRace())
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
    if(!currentRace.isNameUnique(racerData.racer.name)){
        socket.emit('error', { message: 'Racer with this name already exist' })
        return
    }
    if(!currentRace.isCarUnique(parseInt(racerData.racer.carNumber))){
        socket.emit('error', { message: 'Racer with this car number already exist' })
        return
    }

    try{
        currentRace.addParticipant(racer)
    }catch(error){
        socket.emit('error', { message: error.message })
        return
    }
   

    const upcomingRaces = dataStore.getUpcomingRaces()
    io.emit('loadData', JSON.stringify(upcomingRaces))
    // Logs basically
    // Emit racer added
    io.emit('racerAdded', dataStore.getNextRace())
   // socket.emit('racerAdded', racer)
    // Emit state too
    socket.emit('raceState', currentRace.participants)

}

function editRacer(io,editedRacer){
    const race = dataStore.getRaceById(editedRacer.raceId)
    const racer=race.getRacerById(parseInt(editedRacer.racerId))
    console.log(race, racer)
    if (!race.isNameUnique(editedRacer.name, racer.id)) {
        io.emit('error', { message: 'Racer with this name already exist' })
        return
    }
    if(!race.isCarUnique(parseInt(editedRacer.carNumber), racer.id)){
       io.emit('error', { message: 'Racer with this car number already exist' })
        return
    }
    if(editedRacer.carNumber>8){
        io.emit('error', { message: `Car's numbers can be from 1 to 8` })
         return
     }
     racer.name=editedRacer.name
     racer.carNumber=editedRacer.carNumber
     const upcomingRaces = dataStore.getUpcomingRaces()
        io.emit('loadData', JSON.stringify(upcomingRaces))
        io.emit('racerEdited', dataStore.getNextRace())
    }

module.exports = { loadData, addRace, deleteRace, addRacer , deleteRacer,  editRacer

}