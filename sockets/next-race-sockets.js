const dataStore = require('../models/DataStore');


function nextRaceChange(socket, io) {
    console.log('Next race changed');

    const nextRace = dataStore.getNextRace()
    io.emit('nextRaceChange', nextRace)
}

module.exports = { nextRaceChange }