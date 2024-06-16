const dataStore = require('../models/DataStore')
const Race = require('../models/Race')
const { raceChange } = require('../data/database')

function raceModeChange(io, updatedRace) {

    const race = dataStore.getRaceById(updatedRace.raceId)
    race.flagState = updatedRace.flagState

    raceChange(race, 'updaterace')
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
    raceChange(race, 'updaterace')
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
    // Can probably change this to JSON.parse
    const race = dataStore.getRaceById(parseInt(updatedRace.raceId))

    race.raceState = 'Finished'
    race.flagState = 'Danger'
    raceChange(race, 'deleterace')
    io.emit('raceModeChange', race)
    io.emit('loadRaceControl', dataStore.getNextRace())
    // This did not appear to have a function

    const nextR = dataStore.getNextRace()

    if (nextR && nextR.participants.length === 8) {
        io.emit('showMessage', dataStore.getNextRace())
    }
    io.emit('showMessage', dataStore.getNextRace())
    io.emit("renderNextRace", JSON.stringify(race))
    io.emit('raceFinished')
}

module.exports = { raceModeChange, startRace, endRace }