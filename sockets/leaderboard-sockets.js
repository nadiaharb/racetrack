const dataStore = require('../models/DataStore')


function loadData(socket) {
    socket.emit('loadData', JSON.stringify(dataStore.races))
}

module.exports = { loadData }