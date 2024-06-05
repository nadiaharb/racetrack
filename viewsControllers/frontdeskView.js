//const DataStore = require('../models/ DataStore')
/*
const Race = require('../models/Race')

const Racer = require('../models/Racer')
const dataStore= require('../models/ DataStore')



const fs = require('fs')
const path = require('path')
// Define the front desk route handler
function handleFrontDeskRequest(req, res) {
    console.log("TRIGGERED FRONT DESK VIEW")
    // Read the front desk template file and send it as the response
    const filePath = './views/front-desk.html'
    fs.readFile(filePath, 'utf-8', (error, content) => {
        if (error) {
            res.writeHead(500)
            res.end('Sorry, unable to load the front desk template')
        } else {
            console.log(dataStore)
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(content, 'utf-8')
        }
    })
}

// Define the route handler for loading data
function handleLoadDataRequest(req, res) {
    try {
        
        
        const umpcomingRaces=dataStore.getRacesByRaceState("Upcoming")
      
       
        // Send data as a JSON response
       res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(umpcomingRaces))
    } catch (error) {
        console.error('Error loading data:', error)
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Internal Server Error')
        return // Terminate the function execution after sending the error response
    }
}


function addRace(req,res,io){
    console.log("ADDDRACE FROM VIEW")
    let body= ''
    req.on('data', chunk => {
        body += chunk.toString()
    })
    req.on('end', ()=> {
        
        try{
            
            const raceData=JSON.parse(body)
            console.log("RECIEVED", raceData)
            const newRace = new Race(raceData.name)
            newRace.flagState=raceData.flagState
            newRace.statusCode=raceData.statusCode

        // Add data to the DataStore
       
        dataStore.addRace(newRace)
        
            // Emit updated race data to all connected clients via Socket.IO
            const upcomingRaces = dataStore.getRacesByRaceState('Upcoming');
            
            io.emit('loadData', JSON.stringify(upcomingRaces));

            
            res.statusCode=200
            res.setHeader('Content-Type', 'text/plain')
            res.end('Race added successfully')
           
        } catch(error){
             res.statusCode=400
             res.setHeader('Content-Type', 'text/plain')
             res.end('Error: Invalid JSON data')
             console.error('Error parsing JSON:', error)


        }
        
    })

}


function loadData(){
    const dataStore= new DataStore()

//create racer
const racer1 = new Racer(1, 'John Doe')
const race= new Race(r("name of race?", [], 10, "Safe", "current"))
race.addRacer(racer1)
dataStore.addRacer(racer1)
dataStore.addRace(race)

console.log(dataStore)

}

module.exports = {
    handleFrontDeskRequest: handleFrontDeskRequest,
    handleLoadDataRequest: handleLoadDataRequest,
    addRace: addRace
}
*/
