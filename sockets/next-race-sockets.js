
const { dataStore } = require('../models/DataStore');
const Race = require('../models/Race')
const Racer = require('../models/Racer')
//function io = require('./websocketManager') 


function nextRaceChange(socket, io) {
    console.log('Next race changed');

    const nextRace = dataStore.getNextRace()
    io.emit('nextRaceChange', nextRace)
}


module.exports = {nextRaceChange}
