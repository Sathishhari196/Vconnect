//Library and instance
const { Console } = require('console');
const express = require('express');
const app = express();

// socket.io setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  pingInterval:2000, pingTimeout:5000
});

//When we use static files like html,css,etc if you want to be available to each other. we must use below code. It can be accessed by anyone 
app.use(express.static('public'))
app.use(express.static(__dirname +'/Assets'))

//Default HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//Array that stores data in key:value
const backEndUsers = {}
var count=0;
//Whenever user connected to server below function excutes
io.on('connection', (socket) => {
  count++;
  //It prints ID and position of user connected to server
  console.log('User connected List');
  console.log('Total no of users:',count);
  //ID - keys, Object - values
  backEndUsers[socket.id] = {
    x: 10 * Math.random(),//left to right
    z: 10 * Math.random(),
    y: 0.5
  }

  //Send players list to client side
  io.emit('updateUsers', backEndUsers)

  socket.on("updatePosition", (position) => {
    // Handle the updated position here
    //console.log("Received updated position:", socket.id, position);
    
    // Update the position in the backEndUsers object
    backEndUsers[socket.id].x = position.x;
    backEndUsers[socket.id].y = position.y;
    backEndUsers[socket.id].z = position.z;
    
    // Emit the updated position to all connected users
    io.emit("updateUsers", backEndUsers);
  });
  
  //Whenever user disconnected to server below function excutes
  socket.on('disconnect', () => {
    count--;
    //When user disconnect it prints below statement in console
    console.log('User disconnected. No of players remaining: ',count);
    //When user disconnect from server removed from list of user in server
    delete backEndUsers[socket.id]
    //Updated list send to client after user disconnected from server
    io.emit('updateUsers', backEndUsers)
    console.log(backEndUsers)
  });

  //It prints user in server in console
  console.log(backEndUsers)

});

//Server 
server.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});

console.log('Server loaded');
