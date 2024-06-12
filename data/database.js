const Racer = require('../models/Racer')
const sqlite3 = require('sqlite3').verbose();

// Switches
let samples = true  // Add sample races to db
let console_feedback = true // Run console.log on db events. Errors get printed always



// Create database
let db = new sqlite3.Database('./data/raceData.db', (err) => {
    if (err) {
        console.error(err.message);
    } else if (console_feedback) {
        console.log('Connected to SQLite database.');
    }
});

// Create "races" table with a composite primary key (race_id + car)
db.run(`CREATE TABLE IF NOT EXISTS races (
    race_id INTEGER NOT NULL,
    car INTEGER NOT NULL,
    driver TEXT NOT NULL,
    lap1 REAL,
    lap2 REAL,
    lap3 REAL,
    lap4 REAL,
    lap5 REAL,
    lap6 REAL,
    lap7 REAL,
    lap8 REAL,
    lap9 REAL,
    lap10 REAL,
    PRIMARY KEY (race_id, car)
  )`, (err) => { // Callback is used here to ensure table is created before functions try to use it
    if (err) {
        console.error(err.message);
    }
    if (!err && console_feedback) {
        console.log('Database table created');
    }
    if (!err && samples) {
        sampleRaces()
    }
})

// Front desk
// Add new driver or edit pre existing one based on race_id and car number. Calling with empty name will erase that row in db.
function editRacer(raceId, carId, driverName) {

    // If driver name is empty, delete that row
    if (driverName === '') {
        db.run(`DELETE FROM races WHERE race_id = ? AND car = ?`, [raceId, carId], function (err) {
            if (err) {
                return console.error(err.message);
            } else if (console_feedback) {
                console.log(`Row deleted for race_id: ${raceId} and car: ${carId}`);
            }
        });
        return;
    }

    // If name is not empty
    db.get(`SELECT 1 FROM races WHERE race_id = ? AND car = ?`, [raceId, carId], (err, row) => {
        if (err) {
            return console.error(err.message);
        }

        // If there already is such race_id+car combo
        if (row) {
            // Update existing racer
            db.run(`UPDATE races SET driver = ? WHERE race_id = ? AND car = ?`, [driverName, raceId, carId], function (err) {
                if (err) {
                    return console.error(err.message);
                } else if (console_feedback) {
                    console.log(`Database updated with race_id: ${raceId} and car: ${carId}`);
                }
            });
            // If no such row yet
        } else {
            // Insert new racer
            db.run(`INSERT INTO races (race_id, car, driver) VALUES (?, ?, ?)`, [raceId, carId, driverName], function (err) {
                if (err) {
                    return console.error(err.message);
                } else if (console_feedback) {
                    console.log(`New driver stored: ${driverName}`);
                }
            });
        }
    });
}

// Delete whole race
function deleteRace(raceId) {

    db.run(`DELETE FROM races WHERE race_id = ?`, [raceId], function (err) {
        if (err) {
            return console.error(err.message);
        } else if (console_feedback) {
            console.log(`Race ${raceId} deleted from db`);
        }
    });
    return;
}

// Lap line observer
// Function to add lap time. This function is not tested
function addLapTime(raceId, carId, lapTime) {
    let lapNumber = null;

    // Find first empty laptime column
    for (let i = 1; i <= 10; i++) {
        db.get(`
        SELECT lap${i} AS lap
        FROM races
        WHERE race_id = ? AND car = ?
      `, [raceId, carId], (err, row) => {
            if (err) {
                console.error('Error checking lap column:', err.message);
                return;
            }
            // If the lap column is empty, assign the lap number and break the loop
            if (!row.lap) {
                lapNumber = i;
            }
        });

        // If lapNumber is set, break the loop
        if (lapNumber !== null) {
            break;
        }
    }

    if (lapNumber !== null) {
        // If there's an empty lap column, update it with the lap time
        db.run(`
        UPDATE races
        SET lap${lapNumber} = ?
        WHERE race_id = ? AND car = ?
      `, [lapTime, raceId, carId], function (err) {
            if (err) {
                console.error('Error storing lap time:', err.message);
            } else if (console_feedback) {
                console.log(`Lap time added for car ${carId}`);
            }
        });
    } else {
        console.error('Lap time storage full or no such race+driver');
    }
}


// Close the database. Probably will not need this function and can be deleted later
function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
}


// Sample races for testing
function sampleRaces() {
    const racers1 = [
        new Racer(1, 'John Doe'),
        new Racer(2, 'Jane Smith'),
        new Racer(3, 'Alice Johnson'),
        new Racer(4, 'Bob Brown'),
        new Racer(5, 'Charlie Davis'),
        new Racer(6, 'Diana Evans'),
        new Racer(7, 'Evan Williams'),
        new Racer(8, 'Fiona Taylor')
    ];
    const racers2 = [
        new Racer(1, 'George Harris'),
        new Racer(2, 'Hannah Moore'),
        new Racer(3, 'Ian Clark'),
        new Racer(4, 'Julia Thompson'),
        new Racer(5, 'Kevin Martinez'),
        new Racer(6, 'Lily Scott'),
        new Racer(7, 'Michael Lee'),
        new Racer(8, 'Natalie Adams')
    ];

    // Insert sample data
    racers1.forEach(racer => {
        editRacer(1, racer.carNumber, racer.name);
    });
    racers2.forEach(racer => {
        editRacer(2, racer.carNumber, racer.name);
    });
    if (console_feedback) {
        console.log('Sample race data added');
    }
}
