
//const race2 = require('../models/DataStore')
const Race = require('../models/Race')
const Racer = require('../models/Racer')
//function io = require('./websocketManager') 


function nextRaceChange(socket, io, race) {
    console.log('Next race changed');
    io.emit('nextRaceChange', race)
    //dataStore.deleteRaceById(raceId)
    //const upcomingRaces = dataStore.getRacesByRaceByState('Upcoming')
    //io.emit('loadData', JSON.stringify(upcomingRaces))
}


module.exports = {nextRaceChange}
