const RaceState = Object.freeze({ // RaceState enum
    UPCOMING: 'Upcoming',
    IN_PROGRESS: 'In Progress',
    FINISHED: 'Finished',
    ENDED: 'Ended',
    NEXT: 'Next'
});

const FlagState = Object.freeze({ // FlagState enum
    SAFE: 'Safe',
    HAZARD: 'Hazard',
    DANGER: 'Danger',
    FINISH: 'Finish'
});

const Racer = require('./Racer');
let dataStore = null;

class Race {
    // Default duration is set by environment var
    // RaceState and FlagState are enums and contain all possible states
    static lastId = 0
    constructor(duration = process.env.RACE_DURATION, flagState = FlagState.DANGER, raceState = RaceState.UPCOMING) {
        this.id = ++Race.lastId;
        this.participants = []
        this.duration = duration; // Duration of the race (derived from env vars, default)
        this.flagState = flagState; // State of the flag
        this.raceState = raceState; // State of the race
        this.assignedCarNumbers = new Set()
        this.raceTimer = null;
    }
    // Race Methods

    addParticipant(participant) {

        if (this.participants.length >= 8) {

            throw new Error('Race is already full. Cannot add more participants.');
        }
        if (!(participant instanceof Racer)) {
            throw new Error('Participant must be an instance of Racer')
        }
        let carNumber
        if (participant.carNumber && !this.assignedCarNumbers.has(participant.carNumber)) {
            if (participant.carNumber >= 1 && participant.carNumber <= 8) {
                carNumber = participant.carNumber
            } else {
                throw new Error('Car numbers can be from 1 to 8.')
            }

        } else {

            carNumber = 1
            while (this.assignedCarNumbers.has(carNumber) && carNumber <= 8) {
                carNumber++
            }

            if (carNumber > 8) {
                throw new Error('All car numbers from 1 to 8 are already assigned.')
            }

        }

        participant.carNumber = carNumber
        participant.race = this; // Set reference to the parent race
        this.assignedCarNumbers.add(carNumber)

        this.participants.push(participant)
        this.emitChange();
    }

    emitChange() {
        dataStore.notifyChange();
    }

    deleteParticipant(participantId) {
        const index = this.participants.findIndex(p => p.id === participantId)
        if (index !== -1) {
            const deletedParticipant = this.participants.splice(index, 1)[0]
            this.assignedCarNumbers.delete(deletedParticipant.carNumber)
            this.emitChange();
            return deletedParticipant
        } else {
            this.emitChange();
            throw new Error(`Participant with ID ${participantId} not found.`)
        }

    }
    sortParticipants() {
        this.participants.sort((a, b) => {
            if (a.bestLapTime === null) return 1;
            if (b.bestLapTime === null) return -1;
            this.emitChange();
            return a.bestLapTime - b.bestLapTime;
        });
    }

    isNameUnique(name, excludeId = null) {
        return !this.participants.some(p => p.name === name && p.id !== excludeId)
    }
    isCarUnique(carNumber, excludeId = null) {
        return !this.participants.some(p => p.carNumber === carNumber && p.id !== excludeId)
    }

    // Racer Method
    getRacerByCarNumber(carNumber) { // Necessary for Lap Line Observer
        return this.racers.find(racer => racer.carNumber === carNumber);
    }
    getRacerById(participantId) {
        const participant = this.participants.find(participant => participant.id === participantId);
        return participant || null;
    }
    // Flag State - Race State
    getFlagState() {
        return this.flagState;
    }

    setFlagState(state) {
        if (Object.values(FlagState).includes(state)) {
            this.flagState = state;
        } else {
            throw new Error('Invalid race state');
        }
        this.emitChange();
    }

    getRaceState() {
        return this.raceState;
    }

    setRaceState(state) { // This method is used to set the state via enum
        if (this.raceState === RaceState.FINISHED) {
            throw new Error('Race state is FINAL. Cannot change from FINISHED state.');
        }
        if (Object.values(RaceState).includes(state)) {
            this.raceState = state;
        } else {
            throw new Error('Invalid race state');
        }
        this.emitChange();
    }
    // Race Timer logic enclosed here for simplicity.
    startRaceTimer() {
        if (this.raceTimer) {
            clearInterval(this.raceTimer);
        }
        this.raceTimer = setInterval(() => {
            this.duration -= 100; // Decrement race duration
            this.emitChange();
            if (this.duration <= 0) {
                clearInterval(this.raceTimer);
                this.setRaceState(RaceState.ENDED); // PLACEHOLDER TO CORRECT POTENTIAL ISSUES WITH RACESTATE DECLARATIONS  
            }
        }, 100);
    }

    // Custom serialization method to exclude lapTimer
    // Gotta make sure we don't JSONify the timer itself
    toJSON() {
        const { raceTimer, ...rest } = this;
        return rest;
    }

}

Race.setDataStore = function (store) {
    dataStore = store;
};

module.exports = Race;