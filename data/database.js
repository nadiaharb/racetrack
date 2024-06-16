const Racer = require('../models/Racer');
const Race = require('../models/Race');
const sqlite3 = require('sqlite3').verbose();
//const dataStore = require('../models/DataStore');


// Switches
let samples = false;  // Add sample races to db
let consoleFeedback = true; // Run console.log on db events. Errors get printed always

// Create database
let db = new sqlite3.Database('./data/raceData.db', (err) => {
    if (err) {
        console.error(err.message);
    } else if (consoleFeedback) {
        console.log('Connected to SQLite database.');
        // db.run('PRAGMA foreign_keys = ON;'); // Enable foreign keys
    }
    // loadRacesFromDatabase()
});

// Create "racers" table
db.run(`CREATE TABLE IF NOT EXISTS racers (
    racer_id INTEGER PRIMARY KEY,
    car_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    current_lap_time REAL,
    best_lap_time REAL,
    lap_count INTEGER DEFAULT 0,
    race_id INTEGER,
    FOREIGN KEY (race_id) REFERENCES races(race_id)
)`, (err) => {
    if (err) {
        console.error('Error creating racers table:', err.message);
    } else {
        console.log('Racers table created');
    }
});


// Create "races" table with a composite primary key (race_id + car)
db.run(`CREATE TABLE IF NOT EXISTS races (
    race_id INTEGER PRIMARY KEY,
    duration REAL NOT NULL,
    flag_state TEXT NOT NULL,
    race_state TEXT NOT NULL,
    participants TEXT, -- Store participant racer_ids as comma-separated values
    FOREIGN KEY (participants) REFERENCES racers(racer_id)
)`, (err) => {
    if (err) {
        console.error(err.message)
    }
    if (!err && consoleFeedback) {
        console.log('Database table created')
    }
    if (!err && samples) {
        // sampleRaces()
    }
})



// Fragmented dataChange to simplify legibility
function raceChange(changedRace, action) {
    if (changedRace) {
        console.log(`Received data change event for Race ${changedRace.id}. Updating SQLite database...`);
        switch (action) {
            case 'addrace' || 'updateRace':
                console.log(`Adding race: ${changedRace.id}`)
                createUpdateRaceInDb(changedRace);
                break;
            case 'deleterace':
                console.log(`Deleting race: ${changedRace.id}`)
                deleteRace(changedRace.id);
                break;
            /*case 'updaterace':
                console.log(`Updating race: ${changedRace.id}`)
                updateRaceData(changedRace.id, changedRace);
                break;*/
        }
    }
}
function racerChange(changedRacer, action) {
    if (changedRacer) {
        console.log(`Received data change event for Racer ${changedRacer.id}. Updating SQLite database...`);
        switch (action) {
            case 'addracer':
                console.log(`Adding racer: ${changedRacer.id}`)
                addRacerToDb(changedRacer, changedRacer.race.id);
                break;
            case 'deleteracer':
                console.log(`Deleting racer: ${changedRacer.id}`)
                deleteRacerFromDb(changedRacer, changedRacer.race.id);
                break;
            case 'updateracer':
                console.log(`Updating racer: ${changedRacer.id}`)
                updateRacerInDb(changedRacer, changedRacer.race.id);
                break;
        }
    }
}

// Merged creation and updating logic to simplify logic flow
function createUpdateRaceInDb(race) {
    const { id, duration, flagState, raceState } = race;

    db.get("SELECT * FROM races WHERE race_id = ?", [id], (err, row) => {
        if (err) {
            console.error('Error checking race in database:', err.message);
            return;
        }

        if (!row) {
            // If race does not exist in the database, insert it
            db.run(
                `INSERT INTO races (race_id, duration, flag_state, race_state)
                 VALUES (?, ?, ?, ?)`,
                [id, duration, flagState, raceState],
                (err) => {
                    if (err) {
                        console.error('Error inserting race into database:', err.message);
                    } else {
                        console.log(`Race ${id} inserted into SQLite database.`);
                    }
                }
            );
        } else {
            // If race exists, update it
            db.run(
                `UPDATE races 
                 SET duration = ?, flag_state = ?, race_state = ?
                 WHERE race_id = ?`,
                [duration, flagState, raceState, id],
                (err) => {
                    if (err) {
                        console.error('Error updating race data:', err.message);
                    } else {
                        console.log(`Race data updated: ID ${id}`);
                    }
                }
            );
        }
    });
}

// Function to delete a race from the database
function deleteRace(raceId) {
    console.log(raceId);
    db.run(`DELETE FROM races WHERE race_id = ?`, [raceId], function (err) {
        if (err) {
            console.error('Error deleting race:', err.message);
        } else {
            console.log(`Race with ID ${raceId} deleted`);
            deleteParticipantsByRaceId(raceId);
        }
    });
}

function addRacerToDb(racer, raceId) {
    // Fix raceID
    const { id, carNumber, name, bestLapTime, lapTimer, lapCount } = racer;
    db.run(
        `INSERT INTO racers (racer_id, car_number, name, best_lap_time, current_lap_time, lap_count, race_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, carNumber, name, bestLapTime, lapTimer, lapCount, raceId],
        function (err) {
            if (err) {
                console.error('Error inserting racer:', err.message);
            } else {
                console.log(`Racer added: Car ${carNumber} - ${name}`);
                addRacerToRace(raceId, id);
            }
        }
    );
}

function deleteParticipantsByRaceId(raceId) {
    db.run(`DELETE FROM racers WHERE race_id = ?`, [raceId], function (err) {
        if (err) {
            console.error('Error deleting participants:', err.message);
        } else {
            //  console.log(`Deleted ${this.changes} participants from race ID ${raceId}`);
            // Proceed to delete the race after deleting participants
            // deleteRace(raceId);
        }
    });
}

function addRacerToRace(raceId, racerId) {
    // Check if the race exists
    db.get('SELECT * FROM races WHERE race_id = ?', [raceId], (err, row) => {
        if (err) {
            console.error('Error checking race in database:', err.message)
            return
        }

        if (!row) {
            console.error(`Race with ID ${raceId} not found in database.`)
            return
        }

        // Update participants field with racerId
        let updatedParticipants = row.participants ? `${row.participants},${racerId}` : racerId;

        db.run(
            'UPDATE races SET participants = ? WHERE race_id = ?',
            [updatedParticipants, raceId],
            function (err) {
                if (err) {
                    console.error('Error adding racer to race:', err.message)
                } else {
                    console.log(`Racer ${racerId} added to race ${raceId}`);
                }
            }
        );
    });
}

function updateRacerInDb(racer) {
    const { id, carNumber, name, bestLapTime, lapTimer, lapCount } = racer;

    db.serialize(() => {
        db.run(
            `UPDATE racers SET car_number = ?, name = ?, best_lap_time = ?, current_lap_time = ?, lap_count = ? WHERE racer_id = ?`,
            [carNumber, name, bestLapTime, lapTimer, lapCount, id],
            function (err) {
                if (err) {
                    console.error('Error updating racer:', err.message);
                } else {
                    console.log(`Racer updated: ID ${id}; Current Lap: ${lapTimer}`);

                    db.get(`SELECT * FROM racers WHERE racer_id = ?`, [id], (err, row) => {
                        if (err) {
                            console.error('Error fetching updated racer:', err.message);
                        } else {
                            console.log('Updated racer:', row);
                        }
                    });
                }
            }
        );
    });
}

function deleteRacerFromDb(racer) {
    const { id } = racer;
    console.log(id);
    db.run(
        `DELETE FROM racers WHERE racer_id = ?`,
        [id],
        function (err) {
            if (err) {
                console.error('Error deleting racer:', err.message);
            } else {
                console.log(`Racer deleted: ID ${id}`);
                updateRaceParticipants(id);
            }
        }
    );
}

function updateRaceParticipants(racerId) {
    db.all(
        `SELECT race_id, participants FROM races WHERE participants LIKE ?`,
        [`%${racerId}%`],
        (err, rows) => {
            if (err) {
                console.error('Error fetching race participants:', err.message);
                return;
            }

            rows.forEach(row => {
                let participants = row.participants.split(',').map(id => id.trim());
                participants = participants.filter(id => id !== String(racerId));
                const updatedParticipants = participants.join(',');

                db.run(
                    `UPDATE races SET participants = ? WHERE race_id = ?`,
                    [updatedParticipants, row.race_id],
                    (err) => {
                        if (err) {
                            console.error('Error updating race participants:', err.message);
                        } else {
                            console.log(`Race participants updated after racer deletion: Racer ID ${racerId}`);
                        }
                    }
                );
            });
        }
    );
}

function loadRacesFromDatabase(dataStore) {
    let racesQuery = `SELECT * FROM races`;

    db.all(racesQuery, [], (err, rows) => {
        if (err) {
            console.error('Error querying races from database:', err.message);
            return;
        }

        rows.forEach((row) => {
            let race = new Race(row.duration, row.flag_state, row.race_state);
            // DONT FORGET TO SET THE ID
            race.id = row.race_id

            if (row.participants && row.participants.trim() !== '') {
                let participantIds = row.participants.split(',');

                participantIds.forEach((racerId) => {
                    let racerQuery = `SELECT * FROM racers WHERE racer_id = ?`;
                    db.get(racerQuery, [racerId], (err, racerRow) => {
                        if (err) {
                            console.error('Error querying racer from database:', err.message);
                            return;
                        }
                        if (racerRow) {
                            let racer = new Racer(racerRow.car_number, racerRow.name, racerRow.lap_count, racerRow.best_lap_time, racerRow.current_lap_time);
                            // LETS MAKE SURE THE ID MATCHES
                            racer.id = racerRow.racer_id
                            racer.recoverLapTimer(racerRow.current_lap_time);
                            race.addParticipant(racer);
                        }
                    });
                });
            }

            dataStore.addRace(race);
        });
    });
}

/*function dataChange(changedRace, action) {
    if (changedRace) {
        console.log(`Received data change event for Race ${changedRace.id}. Updating SQLite database...`);
        switch (action) {
            case 'addrace':
                console.log(`Adding race: ${changedRace.id}`)
                addRacetoDB(changedRace);
                break;
            case 'addracer':
                changedRace.participants.forEach(p => addRacerToDb(p, changedRace.id));
                break;
            case 'deleteracer':
                changedRace.participants.forEach(p => deleteRacerFromDb(p));
                break;
            case 'updateracer':
                changedRace.participants.forEach(p => updateRacerInDb(p));
                break;
            case 'deleterace':
                deleteRace(changedRace.id);
                break;
            case 'updaterace':
                updateRaceData(changedRace.id, changedRace);
                break;
        }
    }
}*/


/*
function addRacetoDB(changedRace) {
    // Check if the race already exists in the database
    db.get("SELECT * FROM races WHERE race_id = ?", [changedRace.id], (err, row) => {
        if (err) {
            console.error('Error checking race in database:', err.message)
            return
        }
        if (!row) {
            // If race does not exist in the database, insert it
            db.run(
                `INSERT INTO races (race_id, duration, flag_state, race_state)
                 VALUES (?, ?, ?, ?)`,
                [changedRace.id, changedRace.duration, changedRace.flagState, changedRace.raceState],
                (err) => {
                    if (err) {
                        console.error('Error inserting race into database:', err.message)
                    } else {
                        console.log(`Race ${changedRace.id} inserted into SQLite database.`)
                    }
                }
            )
        } else {
            console.log(`Race ${changedRace.id} already exists in the database. Skipping insertion.`)
        }
    })
}
*/
/*
function updateRaceData(raceId, updatedRace) {
    const { duration, flagState, raceState } = updatedRace;

    db.run(
        `UPDATE races 
         SET duration = ?, flag_state = ?, race_state = ?
         WHERE race_id = ?`,
        [duration, flagState, raceState, raceId],
        function (err) {
            if (err) {
                console.error('Error updating race data:', err.message);
            } else {
                console.log(`Race data updated: ID ${raceId}`);
            }
        }
    );
}
* /
/*
function addRacetoDB(changedRace) {
    // Check if the race already exists in the database
    db.get("SELECT * FROM races WHERE race_id = ?", [changedRace.id], (err, row) => {
        if (err) {
            console.error('Error checking race in database:', err.message)
            return
        }
        if (!row) {
            // If race does not exist in the database, insert it
            db.run(
                `INSERT INTO races (race_id, duration, flag_state, race_state)
                 VALUES (?, ?, ?, ?)`,
                [changedRace.id, changedRace.duration, changedRace.flagState, changedRace.raceState],
                (err) => {
                    if (err) {
                        console.error('Error inserting race into database:', err.message)
                    } else {
                        console.log(`Race ${changedRace.id} inserted into SQLite database.`)
                    }
                }
            )
        } else {
            console.log(`Race ${changedRace.id} already exists in the database. Skipping insertion.`)
        }
    })
}
*/
module.exports = { loadRacesFromDatabase, updateRaceParticipants, racerChange, raceChange }