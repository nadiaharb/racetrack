const RaceState = Object.freeze({ // RaceState enum
    UPCOMING: 'Upcoming',
    IN_PROGRESS: 'In Progress',
    FINISHED: 'Finished'
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
    constructor(name, participants = [], duration = process.env.duration, flagState = FlagState.SAFE, raceState = RaceState.UPCOMING) {
        this.name = name; // Name of the race
        this.participants = []
        this.duration = duration; // Duration of the race (derived from env vars, default)
        this.flagState = flagState; // State of the flag
        this.raceState = raceState; // State of the race - make this an enum if necessary
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
    getFlagState() {
        return this.flagState;
    }
    setFlagState(state) { // This method is used to set the state via enum
        if (Object.values(FlagState).includes(state)) {
            this.flagState = state;
        } else {
            throw new Error('Invalid race state');
        }

    }
    // Return specified race default duration
    getDuration() {
        return this.duration;
    }
    // Add participant to race
    addParticipant(participant) {
        // Validate that we are pushing a Racer
        if (participant instanceof Racer) {
            this.participants.push(participant);
        } else {
            throw new Error('Participant must be an instance of Racer');
        }
    }
    changeName(newName) {
        this.name = newName;
    }
}

module.exports = Race;
