const EventEmitter = require('events');
const { RaceState } = require('./enums');
const Race = require('./Race');
const Racer = require('./Racer');

class DataStore extends EventEmitter {
    constructor() {
        super();
        this.races = [];
        Race.setDataStore(this);
        Racer.setDataStore(this);
    }

    // Emit a change event whenever the race data changes
    notifyChange() {
        this.emit('notifyChange');
    }

    // Method to get the current race data
    getRaceData() {
        return {
            inProgressRace: this.getInProgressRace(),
            upcomingRace: this.getNextRace()
        };
    }

    // Race Methods
    /* Replaced this function with getNextRace
        getUpcomingRace() {
            const upcomingRaces = this.races.filter(race => race.raceState === RaceState.UPCOMING);
            if (upcomingRaces.length === 0) {
                return null; //
            }
            return upcomingRaces.reduce((minRace, currentRace) => {
                return currentRace.id <= minRace.id ? currentRace : minRace;
            });
        }
    */
    // Get all upcoming races sorted by race id
    getUpcomingRaces() {
        // Find all races with raceState Upcoming
        const upcomingRaces = this.races.filter(race => race.raceState === RaceState.UPCOMING);
        // If no upcoming races
        if (upcomingRaces.length === 0) {
            return null;
        }
        // Sort races by id
        upcomingRaces.sort((a, b) => a.id - b.id);
        return upcomingRaces;
    }

    // Get next race (to be started after the one in progress)
    getNextRace() {
        const upcomingRaces = this.getUpcomingRaces();
        // If no upcoming races
        if (upcomingRaces) {
            return upcomingRaces[0];
        }
    }

    // Get ongoing race
    getInProgressRace() {
        const inProgressRaces = this.races.filter(race => race.raceState === RaceState.IN_PROGRESS);
        if (inProgressRaces.length === 0) {
            return null; // 
        }
        if (inProgressRaces.length > 1) {
            throw new Error('Error! Multiple races in progress');
        }
        return inProgressRaces[0];
    }

    addRace(race) {
        this.races.push(race);
    }
    getRaceByFlag() {

    }

    deleteRaceById(raceId) {
        raceId = parseInt(raceId);
        const index = this.races.findIndex(race => race.id === raceId);

        if (index !== -1) { // Check if the race was found
            this.races.splice(index, 1);
            return true;
        } else {
            return false; // Indicate that the race was not found
        }
    }
    //get upcoming races
    getUpcomingRacesByFlag(flagState) {
        const upcomingRaces = this.getUpcomingRaces()
        if (upcomingRaces) {
            return upcomingRaces.filter(race => race.flagState === flagState)
        }
    }
    getRaceById(raceId) {

        return this.races.find(race => race.id === raceId);
    }


    getRaces() {
        return this.races;
    }

    getRaceByRaceID(id) {
        const race = this.races.find(race => race.id === id);
        if (race) {
            return race
        } else {
            return null
        }
    }
    /*
        getRacesByRaceByState(raceState) {
            return this.races.filter(race => race.raceState === raceState);
        }
    */

    // Racer Methods

    addRacerToRace(raceID, racer) {
        const race = this.getRaceById(raceID)
        if (race) {
            if (racer instanceof Racer) {
                race.participants.push(racer)
            } else {
                throw new Error('Participant must be an instance of Racer')
            }
        } else {
            throw new Error('Race not found')
        }
    }

    getRacersByRaceID(id) {
        const matchingRace = this.races.find(race => race.id === id);
        if (matchingRace) {
            return matchingRace.participants;
        } else {
            return null;
        }
    }

}

const dataStore = new DataStore();

// Sample races for testing
const racers1 = [
    new Racer(1, 'John Doe'),
    new Racer(2, 'Jane Smith'),
    new Racer(3, 'Alice Johnson'),
    new Racer(4, 'Bob Brown'),
    new Racer(5, 'Charlie Davis'),
    new Racer(6, 'Diana Evans'),
    new Racer(7, 'Evan Williams'),
    new Racer(8, 'Fiona Taylor')
];
const racers2 = [
    new Racer(1, 'George Harris'),
    new Racer(2, 'Hannah Moore'),
    new Racer(3, 'Ian Clark'),
    new Racer(4, 'Julia Thompson'),
    new Racer(5, 'Kevin Martinez'),
    new Racer(6, 'Lily Scott'),
    new Racer(7, 'Michael Lee'),
    new Racer(8, 'Natalie Adams')
];

const race1 = new Race();
racers1.forEach(racer => race1.addParticipant(racer));
race1.flagState = 'Danger';
race1.raceState = RaceState.UPCOMING;

const race2 = new Race();
racers2.forEach(racer => race2.addParticipant(racer));
race2.flagState = 'Danger';
race2.raceState = RaceState.UPCOMING;

dataStore.addRace(race1);
dataStore.addRace(race2);

console.log(race1);
console.log(race2);

module.exports = dataStore;
