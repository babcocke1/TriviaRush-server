const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const Game  = require("./utils/game")
const app = express();
const server = http.createServer(app);
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
const whitelist = ["http://localhost:3000", "https://trivia-rush-client.herokuapp.com"]
const io = require("socket.io")(server, {
    cors: {
      origin: whitelist,
      methods: ["GET", "POST"]
    }
  });

let playerQueue = []
io.on('connection', socket => {
    console.log("CONNNECTION")
    socket.on("disconnect", m => {
        if (socket.hasOwnProperty('game')) {
            socket.game.endGame(3);
        }
    });
    socket.on('message', m => console.log(m))
    socket.on("enterQueue", (user) => {
        // check if unique
        // check if other player in queue
        // yes: make room, start game
        // no: add player to queue
        console.log(user, socket.id);
        user.pid = socket.id;
        let inQueue = false;
        console.log("inq: ", inQueue);
        inQueue = playerQueue.some(player => {
            if (player.id === user.pid) {
                console.log("player found");
                return true;
            }
        });
        console.log("inq?: ", inQueue);
        
        if (!inQueue) playerQueue.push(user);

        while (playerQueue.length > 1) {
            player1 = playerQueue.shift();
            player2 = playerQueue.shift();
            console.log("made match!!!"); 
            // const s1 = io.sockets.sockets.get(player1.id);
            // const s2 = io.sockets.sockets.get(player2.id);
            g = new Game(player1,player2,io)
            g.startGame();
            socket.game = g;
            // s1.join(gid)
            // s2.join(gid)
            // io.to(gid).emit("my message", gid);
            // console.log(gid)
            // createGame(player1,player2,gid);
        }

        console.log("currentQueue", playerQueue);
        // // console.log("message", "start timeout test");  
        // // setTimeout(myFunc, 1500, 'funky');
        // // console.log ("message", "end timeout test");

        
    });
});
function myFunc(arg) {
    console.log(`arg was => ${arg}`);
}


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));