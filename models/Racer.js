class Racer {
    constructor(carNumber, name) {
        this.id = this.generateRandomId()
        this.carNumber = carNumber
        this.name = name
        this.bestLapTime = this.bestLapTime
        this.collectedLapTimes = []; // BONUS
        this.currentLapTime = this.currentLapTime // BONUS
    }
    generateRandomId() {
        return Math.floor(Math.random() * 1000000)
    }
}


module.exports = Racer;