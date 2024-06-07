const dataStore = require('../models/DataStore')


function loadData(socket) {
    socket.emit('loadData', JSON.stringify(dataStore.getInProgressRace()))
}

module.exports = { loadData }