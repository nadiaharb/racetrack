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
    PRIMARY KEY (race_id, car)
  )`, (err) => { // Callback is used here to ensure table is created before functions try to use it
    if (err) { console.error(err.message); }
    else if (console_feedback) {
        console.log('Database table created');
    }
})


// Function for front desk. Call to add new driver or edit pre existing one based on race_id and car number. Calling with empty name will erase that row in db.
function editRacer(race_id, car, driver) {

    // If driver name is empty, delete that row
    if (driver === '') {
        db.run(`DELETE FROM races WHERE race_id = ? AND car = ?`, [race_id, car], function (err) {
            if (err) {
                return console.error(err.message);
            } else if (console_feedback) {
                console.log(`Row deleted for race_id: ${race_id} and car: ${car}`);
            }
        });
        return;
    }

    // If name is not empty
    db.get(`SELECT 1 FROM races WHERE race_id = ? AND car = ?`, [race_id, car], (err, row) => {
        if (err) {
            return console.error(err.message);
        }

        // If there already is such race_id+car combo
        if (row) {
            // Update existing racer
            db.run(`UPDATE races SET driver = ? WHERE race_id = ? AND car = ?`, [driver, race_id, car], function (err) {
                if (err) {
                    return console.error(err.message);
                } else if (console_feedback) {
                    console.log(`Database updated with race_id: ${race_id} and car: ${car}`);
                }
            });
            // If no such row yet
        } else {
            // Insert new racer
            db.run(`INSERT INTO races (race_id, car, driver) VALUES (?, ?, ?)`, [race_id, car, driver], function (err) {
                if (err) {
                    return console.error(err.message);
                } else if (console_feedback) {
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                }
            });
        }
    });
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
if (samples) {

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

