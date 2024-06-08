




const dataStore = require('../models/DataStore')
const Race = require('../models/Race')



function raceModeChange( io, updatedRace) {
    
    const race=dataStore.getRaceById(updatedRace.raceId)
   
    race.flagState=updatedRace.flagState
    io.emit('raceModeChanged', race)
    //frontDesk
   
    io.emit('loadData',JSON.stringify(dataStore.getUpcomingRacesByFlag("Danger")) )
    io.emit('loadRaceControl', dataStore.getInProgressRace())
    
}

function startRace(io,updatedRace){
    const race=dataStore.getRaceById(parseInt(updatedRace.raceId))
    race.flagState=updatedRace.flagState
    race.raceState="In Progress"

    io.emit("raceStarted", dataStore.getInProgressRace())
    //io.emit('loadRaceControl', dataStore.getInProgressRace())
    io.emit('loadData',JSON.stringify(dataStore.getUpcomingRacesByFlag("Danger")) )
    io.emit('raceModeChanged', updatedRace)

}

function endRace(io, updatedRace){
    const race=dataStore.getRaceById(parseInt(updatedRace.raceId))
    
    race.raceState="Finished"
      console.log(race.raceState)
    io.emit('loadRaceControl', dataStore.getNextRace())
}

module.exports = {raceModeChange, startRace,endRace}