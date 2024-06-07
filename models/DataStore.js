const { RaceState } = require('./enums');
const Race = require('./Race');
const Racer = require('./Racer');

class DataStore {
    constructor() {
        this.races = [];
        this.racers = []; // Assuming you need a place to store racers
    }

    // Get all upcoming races sorted by id
    getUpcomingRaces() {
		// Find all races with raceState Upcoming
        const upcomingRaces = this.races.filter(race => race.raceState === RaceState.UPCOMING);
		// Sort races by id
		upcomingRaces.sort((a, b) => a.id - b.id);
		return upcomingRaces
    }

	// Get the first upcoming race (Aka the next one)
    getNextRace() {
		// Find all upcoming races sorted by id
		const upcomingRaces = this.getUpcomingRaces()
		// Return race with smallest id, which is the next race
		return upcomingRaces[0]
    }

    // Get the in-progress race
    getInProgressRace() {
        const inProgressRaces = this.races.filter(race => race.raceState === RaceState.IN_PROGRESS);
        if (inProgressRaces.length === 0) {
            return null;
        }
        if (inProgressRaces.length > 1) {
            throw new Error('Error! Multiple races in progress');
        }
        return inProgressRaces[0];
    }

    // Race methods
    addRace(race) {
        this.races.push(race);
    }

    deleteRaceById(raceId) {
        raceId = parseInt(raceId);
        const index = this.races.findIndex(race => race.id === raceId);
        if (index !== -1) {
            this.races.splice(index, 1);
            return true;
        }
        return false;
    }

    getRaceById(raceId) {
        return this.races.find(race => race.id === raceId);
    }

    getRaces() {
        return this.races;
    }

    addRacer(racer) {
        this.racers.push(racer);
    }

    addRacerToRace(raceId, racer) {
        const race = this.getRaceById(raceId);
        if (race) {
            if (racer instanceof Racer) {
                race.participants.push(racer);
            } else {
                throw new Error('Participant must be an instance of Racer');
            }
        } else {
            throw new Error('Race not found');
        }
    }

    getRacerByCarNumber(carNumber) {
        return this.racers.find(racer => racer.carNumber === carNumber);
    }

    getRacersByRaceID(id) {
        const matchingRace = this.races.find(race => race.id === id);
        if (matchingRace) {
            return matchingRace.participants;
        } else {
            return null;
        }
    }

    getRacers() {
        return this.racers;
    }

    getRacesByRaceByState(findRaceState) {
        return this.races.filter(race => race.raceState === findRaceState);
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
race1.raceState = RaceState.IN_PROGRESS;

const race2 = new Race();
racers2.forEach(racer => race2.addParticipant(racer));
race2.flagState = 'Danger';
race2.raceState = RaceState.UPCOMING;

dataStore.addRace(race1);
dataStore.addRace(race2);

console.log(race1);
console.log(race2);

module.exports = { dataStore };
