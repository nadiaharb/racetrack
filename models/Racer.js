let dataStore = null;

class Racer {
    constructor(carNumber, name, lapCount = 0, bestLapTime = 0) {
        this.id = this.generateRandomId();
        this.carNumber = carNumber;
        this.name = name;
        this.bestLapTime = bestLapTime;
        this.currentLapTime = 0; // Initialize current lap time
        this.lapCount = lapCount;
        this.lapTimer = null; // Initialize lap timer
        this.race = null; // Reference to the parent race
    }

    emitChange() {
        dataStore.notifyChange();
    }

    generateRandomId() {
        return Math.floor(Math.random() * 1000000);
    }

    // Necessary for Receptionist bonus functionality
    changeCarNumber(carNumber) {
        this.carNumber = carNumber;
        this.emitChange();
    }

    // Lap elapsing logic contained within Racer data model for simplicity
    elapseLap() {
        if (this.lapTimer) {
            clearInterval(this.lapTimer);
        }
        this.lapCount++; // Increment lap count
        if (this.bestLapTime === 0 || this.currentLapTime < this.bestLapTime) {
            if (this.currentLapTime !== 0) {
                this.bestLapTime = this.currentLapTime; // Update best lap time
            }
        }
        this.currentLapTime = 0; // Reset current lap time
        this.startLapTimer(); // Start new lap timer
    }

    // Lap Timer logic enclosed here for simplicity.
    startLapTimer() {
        /*if (this.lapTimer) {
            clearInterval(this.lapTimer);
        }*/
        this.currentLapTime = 0;
        this.lapTimer = setInterval(() => {
            this.currentLapTime += 100; // Increment timer every second
        }, 100);
        this.emitChange();
    }

    // Custom serialization method to exclude lapTimer
    // Gotta make sure we don't JSONify the timer itself
    toJSON() {
        const { lapTimer, race, ...rest } = this;
        return rest;
    }
}

Racer.setDataStore = function (store) {
    dataStore = store;
};


module.exports = Racer;