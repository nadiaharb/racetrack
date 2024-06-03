const DataStore = require('../models/ DataStore')
const Race = require('../models/Race')
const Racer = require('../models/Racer')
const dataStore= new DataStore()



const fs = require('fs');
const path = require('path');
// Define the front desk route handler
function handleFrontDeskRequest(req, res) {
    // Read the front desk template file and send it as the response
    const filePath = './views/front-desk.html';
    fs.readFile(filePath, 'utf-8', (error, content) => {
        if (error) {
            res.writeHead(500);
            res.end('Sorry, unable to load the front desk template');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
}

// Define the route handler for loading data
function handleLoadDataRequest(req, res) {
    try {
        // Create sample data
        const racer1 = new Racer(1, 'John Doe');
        const race1 = new Race('Race 1', [racer1], 10, 'Safe', 'Current');

        // Add data to the DataStore
        dataStore.addRacer(racer1);
        dataStore.addRace(race1);

        // Send data as a JSON response
       res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(dataStore));
    } catch (error) {
        console.error('Error loading data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return; // Terminate the function execution after sending the error response
    }
}

/*
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
*/
module.exports = {
    handleFrontDeskRequest: handleFrontDeskRequest,
    handleLoadDataRequest: handleLoadDataRequest
}
