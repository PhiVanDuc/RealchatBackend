const { Server } = require('socket.io');

const { online, offline } = require("./activity-status");
const { joinRoom, leaveRoom } = require("./room");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000', 'https://realchat-three.vercel.app'],
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            optionsSuccessStatus: 200,
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        online(io, socket);
        joinRoom(io, socket);
        leaveRoom(io, socket);

        socket.on('disconnect', () => {
            offline(io, socket);
        })
    })
}

const getIO = () => io;

module.exports = {
    initSocket,
    getIO
}