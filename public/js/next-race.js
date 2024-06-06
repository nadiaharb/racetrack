
const socket = io('http://localhost:3000')

socket.on('nextRaceChange', race => {    
    const container = document.getElementById('nextRaceContainer')

    let list = 'Next race <br><br>'
    for (let i = 0; i < race.participants.length; i++) {
        list += 'Car ' + race.participants[i].carNumber + ' : ' + race.participants[i].name + '<br>'
    }

    container.innerHTML = JSON.stringify(list)
   
    console.log(JSON.stringify(race.participants))
        
})

