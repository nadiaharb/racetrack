const { RaceState } = require('./enums')
require('./Race')
require('./Racer')


class DataStore {
	constructor() {
		this.races = [];
	}
	// Get the first upcoming race (Aka the next one)
	getUpcomingRace() {
		const upcomingRaces = this.races.filter(race => race.raceState === RaceState.UPCOMING);
		if (upcomingRaces.length === 0) {
			return null; //
		}
		return upcomingRaces.reduce((minRace, currentRace) => {
			return currentRace.id < minRace.id ? currentRace : minRace;
		});
	}
	// Get the in progress race
	getInProgressRace() {
		const inProgressRaces = this.races.filter(race => race.raceState === RaceState.IN_PROGRESS);
		if (inProgressRaces.length === 0) {
			return null; // 
		}
		if (inProgressRaces.length > 1) {
			throw new Error('Multiple races in progress');
		}
		return inProgressRaces[0];
	}
	// Race methods
	addRace(race) {
		this.races.push(race);
	}
	deleteRaceById(raceId) {
		raceId = parseInt(raceId)
		const index = this.races.findIndex(race => race.id === raceId)
		this.races.splice(index, 1)
		return true


	}
	getRaceById(raceId) {
		return this.races.find(race => race.id === raceId)
	}


	getRaces() {
		return this.races;
	}

	addRacer(racer) {
		this.racers.push(racer);
	}
	addRacerToRace(raceId, racer) {
		const race = this.getRaceById(raceId)
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

	getRacerByCarNumber(carNumber) { // Necessary for Lap Line Observer
		return this.racers.find(racer => racer.carNumber === carNumber);
	}

	getRacersByRaceID(id) {
		const matchingRace = this.races.find(race => race.id === id);
		if (matchingRace) {
			return matchingRace.participants;
		} else {
			return null; // or throw an error if you prefer
		}
	}

	getRacers() {
		return this.racers;
	}
	getRacesByRaceByState(raceState) {
		return this.races.filter(race => race.raceState === raceState);
	}
}

const dataStore = new DataStore();

module.exports = dataStore

