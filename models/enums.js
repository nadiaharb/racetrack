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

module.exports = {
    RaceState,
    FlagState
};