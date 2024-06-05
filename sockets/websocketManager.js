
const dataStore = require('../models/ DataStore')
const Race = require('../models/Race')
const { loadData, addRace, deleteRace,addRacer } = require('./front-desk-sockets')
module.exports = function (io) {


    io.on('connection', socket => {
        console.log('User connected to socket')

        // Load Data 
        socket.emit('loadData', JSON.stringify(dataStore.races))

        // Add Race 
        socket.on('addRace', newRace => {
            addRace(socket, io, newRace)
        })

        // Delete Race 
        socket.on('deleteRace', raceId => {
            deleteRace(socket, io, raceId)
        })
        //add racer
        socket.on('addRacer', racerData =>{
            addRacer(socket, io,racerData)
        })
       
        // Handle disconnect event
        socket.on('disconnect', () => {
            console.log('User disconnected')
        })
    })
}
