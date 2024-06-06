
const dataStore = require('../models/DataStore')
const Race = require('../models/Race')
const { loadData, addRace, deleteRace, addRacer } = require('./front-desk-sockets')
const { raceModeChange} = require('./race-control-sockets')

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
        socket.on('addRacer', racerData => {
            addRacer(socket, io, racerData)
        })
        socket.on('resetLapTimer', currentRace => {
            //resetLapTimer(socket, io, currentRace)
        })

        // Change current race flagState
        //socket.on('changeFlagState', mode => {
            //dataStore.getUpcomingRace().setFlagState(mode);
        //    const race = dataStore.getInProgressRace()
        //    race.setFlagState(mode);
        //    console.log(dataStore.getUpcomingRace());

        //})

        // Handle disconnect event
        socket.on('disconnect', () => {
            console.log('User disconnected')
        })

        // Race control / Safety official

        // Change current race flagState
        socket.on('raceModeChange', mode => {
            raceModeChange(socket, io, mode)
        })
    })
}
