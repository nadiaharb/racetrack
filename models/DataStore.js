const { RaceState } = require('./enums')
const Race = require('./Race')
const Racer = require('./Racer')


class DataStore {
	constructor() {
		this.races = [];
	}

	// Race Methods

	getUpcomingRace() {
		const upcomingRaces = this.races.filter(race => race.raceState === RaceState.UPCOMING);
		if (upcomingRaces.length === 0) {
			return null; //
		}
		return upcomingRaces.reduce((minRace, currentRace) => {
			return currentRace.id <= minRace.id ? currentRace : minRace;
		});
	}

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

	addRace(race) {
		this.races.push(race);
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

	getRacesByRaceByState(raceState) {
		return this.races.filter(race => race.raceState === raceState);
	}

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
			return null; // or throw an error if you prefer
		}
	}

}

const dataStore = new DataStore();

module.exports = dataStore