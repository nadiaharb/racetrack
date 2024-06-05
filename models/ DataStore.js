class DataStore {
	constructor() {
		this.races = [];
		this.racers = [];
	}
	/*
	addRacer(racer, carNumber) {
		racer.carNumber = carNumber;
		this.racers.push(racer);

	}
    */
	// Race methods
	addRace(race) {
		this.races.push(race);
	}
	deleteRaceById(raceId) {
		raceId=parseInt(raceId)
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

	// User methods
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

	getRacers() {
		return this.racers;
	}
	getRacesByRaceByState(raceState) {
        return this.races.filter(race => race.raceState === raceState);
    }
}

const dataStore = new DataStore();

module.exports = dataStore

