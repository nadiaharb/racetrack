const socket = io('http://localhost:3000')

console.log("here")

document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:3000')

    socket.on('loadData', function(loadedData) {
        try {
            const races = JSON.parse(loadedData)
            if (races) {
                console.log(races)
            }
        } catch (error) {
            console.error('Error parsing or handling data:', error)
        }
    })
})