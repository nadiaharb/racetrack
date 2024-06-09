const socket=io()
//const socket = io('http://localhost:3000')
const startBtn=document.getElementById("startBtn")
const raceModeBtns= document.querySelector(".race-mode-container")
const modeDisplay= document.getElementById("modeDisplay")
const startTitle=document.getElementById('start-title')
const modeBtns=document.querySelectorAll('.modeBtn')
const finishDiv=document.querySelector(".end-race-container")
const endBtn=document.getElementById('endBtn')
const table=document.querySelector(".table-container")



socket.on('loadRaceControl', race=>{
   
    renderRace(race)
})

socket.on('racerDeleted', (race) => {
    console.log("racer deletr")
    renderRace(race)
}) 
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
  
    if(race===null){
        table.style.display='none'
        startBtn.style.display='none'
        raceModeBtns.style.display='none'
        startTitle.innerHTML="No Upcoming Races"
        finishDiv.style.display='none'

        return
    }
    endBtn.setAttribute('raceId', race.id);
    startBtn.setAttribute('raceId', race.id);

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
     }else{
        
   startBtn.style.display='inline'
   raceModeBtns.style.display='none'
    //modeDisplay.innerHTML=race.flagState
    startTitle.innerHTML="Start Race"
    finishDiv.style.display='none'

    
     }

        modeBtns.forEach(btn => {

            btn.addEventListener('click', function(e){
                e.preventDefault()
                const state = this.getAttribute('data-state')
                
                if(state==="Finish"){
                    
                    modeBtns.forEach(btn => {
                        btn.disabled = true;
                        btn.style.backgroundColor = 'grey';
                        endBtn.style.backgroundColor='red'
                    })
                    
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

startBtn.addEventListener('click', function(e) {
    e.preventDefault()
    
    const raceIdBtn= startBtn.getAttribute('raceId')
    modeBtns.forEach(btn => {
        btn.disabled = false;
        btn.style.backgroundColor = ''; // This will reset to the default background color
    });
    
    endBtn.style.backgroundColor = ''; // This will reset to the default background color
    
    finishDiv.style.display = 'none';
    raceModeBtns.style.display='block'
    modeDisplay.innerHTML="Safe"
    const updatedMode={
        flagState: "Safe",
        raceId:raceIdBtn
    }
   
    socket.emit("startedRace", updatedMode)
    })




endBtn.addEventListener('click', function(e){
    e.preventDefault()
    
    const raceIdBtn= endBtn.getAttribute('raceId')
    console.log("END", raceIdBtn)
    const updateRace={
        raceId:raceIdBtn,
        
       

    }
 
    
    socket.emit('endRace', updateRace)
}) 
 
