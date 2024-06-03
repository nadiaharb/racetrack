//require('dotenv').config()
//const express=require('express')
//const fs = require('fs');
//const path=require('path')
const http = require('http');
const routes = require('./routes')
const server = http.createServer(routes)
//const { createServer }= require('http')
const { Server }=require('socket.io')
const websocketManager = require('./sockets/websocketManager')
//const app=express()
//const server=createServer(app)






const io=new Server(server)
/*
//static files  with express
app.use(express.static(path.join(__dirname, 'public')))

//routes with express
app.use('/',routes)

*/

const PORT= process.env.PORT || 3000
server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
    //console.log(process.env)
    console.log(`${process.env.RECEPTIONIST_KEY}`)
    
})


websocketManager(io)
//RECEPTIONIST_KEY=8ded6076 OBSERVER_KEY=662e0f6c SAFETY_KEY=a2d393bc npm start
