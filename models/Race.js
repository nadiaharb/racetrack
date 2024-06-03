class Race {
    constructor(name, participants, duration, flagState, raceState) {
        this.name = name; // Name of the race
        this.participants = participants; // List of participants
        this.duration = duration; // Duration of the race (derived from env vars, default)
        this.flagState = flagState; // State of the flag
        this.raceState = raceState; // State of the race - make this an enum if necessary
    }
}

module.exports = Race;
