const dataStore = require('../models/DataStore')
const Race = require('../models/Race')


function raceModeChange(io, updatedRace) {

    const race = dataStore.getRaceById(updatedRace.raceId)
    race.flagState = updatedRace.flagState


    if (race.flagState === "Finish") {
        io.emit("flagFinish")
    }
    //io.emit('raceModeChanged', race)
    io.emit('raceModeChange', race)
    //frontDesk


    io.emit('loadData', JSON.stringify(dataStore.getUpcomingRacesByFlag("Danger")))

    io.emit('loadRaceControl', dataStore.getInProgressRace())

}

// updatedRace is not a VALID RACE OBJECT! Just incase!
function startRace(io, updatedRace) {

    const race = dataStore.getRaceById(parseInt(updatedRace.raceId))

    race.flagState = updatedRace.flagState
    race.raceState = "In Progress"

    //io.emit("raceStarted", dataStore.getInProgressRace())
    //io.emit('loadRaceControl', dataStore.getInProgressRace())
    if (dataStore.getUpcomingRacesByFlag("Danger") === null) {
        io.emit('loadData', null)
    } else {
        io.emit('loadData', JSON.stringify(dataStore.getUpcomingRacesByFlag("Danger")))
    }

    io.emit('raceModeChange', updatedRace)
}

function endRace(io, updatedRace) {
    const race = dataStore.getRaceById(parseInt(updatedRace.raceId))

    race.raceState = 'Finished'
    race.flagState = 'Danger'
    io.emit('raceModeChange', race)
    //
    io.emit('loadRaceControl', dataStore.getNextRace())
    // Emit message to Racers In regards to upcoming race
    io.emit('showMessage', dataStore.getNextRace())
    io.emit("renderNextRace", JSON.stringify(race))
    io.emit('raceFinished')
}

module.exports = { raceModeChange, startRace, endRace }