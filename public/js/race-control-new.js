const socket=io()
//const socket = io('http://localhost:3000')
const startBtn=document.getElementById("startBtn")
const raceModeBtns= document.querySelector(".race-mode-container")
const modeDisplay= document.getElementById("modeDisplay")
const startTitle=document.getElementById('start-title')
const modeBtns=document.querySelectorAll('.modeBtn')
const finishDiv=document.querySelector(".end-race-container")
const endBtn=document.getElementById('endBtn')



socket.on('loadRaceControl', race=>{
   
    renderRace(race)
})

socket.on('racerDeleted', (race) => {
    console.log("racer deletr")
    renderRace(race)
}) //
socket.on('racerAdded', (race) => {
    console.log("racer added")
    renderRace(race)
})

socket.on('racerEdited', (race) => {
    console.log("racer edited")
    renderRace(race)
})  

socket.on('raceStarted', (race) => {
    
    renderModeBtns(race)
})

function renderRace(race) {
    console.log(typeof race)
    endBtn.setAttribute('raceId', race.id);

    for (let i = 1; i <= 8; i++) {
        document.getElementById(`driver${i}`).textContent = ''
    }

   
    race.participants.forEach(participant => {
        const carNumber = participant.carNumber
        const driverCell = document.getElementById(`driver${carNumber}`)
        if (driverCell) {
            driverCell.textContent = participant.name
        }
    })
    
     if (race.raceState=="In Progress"){
        renderModeBtns(race)
     }
     
    startBtn.addEventListener('click', function() {
        raceModeBtns.style.display='block'
        modeDisplay.innerHTML=race.flagState
        const updatedMode={
            flagState: "Safe",
            raceId:race.id
        }
       
        socket.emit("startedRace", updatedMode)
        })


        modeBtns.forEach(btn => {

            btn.addEventListener('click', function(e){
                e.preventDefault()
                const state = this.getAttribute('data-state')
                
                if(state==="Finish"){
                    finishDiv.style.display='block'
                    const updateRace={
                        raceId:race.id,
                        flagState: state
                    }
                   
                    socket.emit('raceModeChange', updateRace)
                    
                }else{
                    const updateRace={
                        raceId:race.id,
                        flagState: state
                    }
                   
                    socket.emit('raceModeChange', updateRace)
                }
               
                
            })
        
        })
      

}


function renderModeBtns(race){
    endBtn.setAttribute('raceId', race.id);

   startBtn.style.display='none'
   raceModeBtns.style.display='block'
    modeDisplay.innerHTML=race.flagState
    startTitle.innerHTML=race.raceState
    
    

}
/*

const raceIdBtn = endBtn.getAttribute('raceId')
endBtn.addEventListener('click', endSession(raceIdBtn))  
function endSession(raceIdBtn){
    console.log("END")
    const updateRace={
        raceId:raceIdBtn,
        
       

    }

    socket.emit('endRace', updateRace)
    
}
*/