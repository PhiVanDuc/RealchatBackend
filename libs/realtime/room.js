module.exports = {
    joinRoom: (io, socket) => {
        if (!io || !socket) return;

        socket.on("join-room", (roomId) => {
            if (!roomId) return;
            socket.join(roomId);
        });
    },
    leaveRoom: (io, socket) => {
        if (!io || !socket) return;
        
        socket.on("leave-room", (roomId) => {
            if (!roomId) return;
            socket.leave(roomId);
        });
    }
}