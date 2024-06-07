




const dataStore = require('../models/DataStore')
const Race = require('../models/Race')



function raceModeChange(socket, io, mode) {
    console.log('Race mode changed to: ' + mode);
    io.emit('raceModeChange', mode)
    //dataStore.deleteRaceById(raceId)
    //const upcomingRaces = dataStore.getRacesByRaceByState('Upcoming')
    //io.emit('loadData', JSON.stringify(upcomingRaces))
}


module.exports = {raceModeChange}