const RaceState = Object.freeze({ // RaceState enum
    UPCOMING: 'Upcoming',
    IN_PROGRESS: 'In Progress',
    FINISHED: 'Finished',
    NEXT: 'Next'
});

const FlagState = Object.freeze({ // FlagState enum
    SAFE: 'Safe',
    HAZARD: 'Hazard',
    DANGER: 'Danger',
    FINISH: 'Finish'
});

const Racer = require('./Racer');

class Race {
    // Default duration is set by environment var
    // RaceState and FlagState are enums and contain all possible states
    static lastId = 0
    constructor(duration = process.env.RACE_DURATION, flagState = FlagState.SAFE, raceState = RaceState.UPCOMING) {
        this.id = ++Race.lastId;
        this.participants = []
        this.duration = duration; // Duration of the race (derived from env vars, default)
        this.flagState = flagState; // State of the flag
        this.raceState = raceState; // State of the race
    }
    // Race Methods

    addParticipant(participant) {
        // Validate that we are pushing a Racer
        if (participant instanceof Racer) {
            (this.participants).push(participant);
        } else {
            throw new Error('Participant must be an instance of Racer');
        }
    }

    // Racer Method
    getRacerByCarNumber(carNumber) { // Necessary for Lap Line Observer
        return this.racers.find(racer => racer.carNumber === carNumber);
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
    }

}

module.exports = Race;