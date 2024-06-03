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

	getRaces() {
		return this.races;
	}

	// User methods
	addRacer(racer) {
		this.racers.push(racer);
	}

	getRacerByCarNumber(carNumber) { // Necessary for Lap Line Observer
		return this.racers.find(racer => racer.carNumber === carNumber);
	}

	getRacers() {
		return this.racers;
	}

}

module.exports = DataStore;
