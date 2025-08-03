const _ = require("lodash");
const userOnlines = new Map();

const emitOnlineUsers = _.debounce((io) => {
    io.emit("online-users", Array.from(userOnlines.keys()));
}, 2000);

module.exports = {
    online: (io, socket) => {
        // Kiểm tra dữ liệu
        const socketId = socket?.id;
        const accountId = socket.handshake.auth?.accountId;
        if (!io || !socketId || !accountId) return;

        // Người dùng chưa tồn tại trong map
        if (!userOnlines.has(accountId)) userOnlines.set(accountId, [socketId]);
        // Người dùng đã tồn tại trong map
        else {
            const socketIds = [...userOnlines.get(accountId)];

            if (!socketIds.includes(socketId)) {
                socketIds.push(socketId);
                userOnlines.set(accountId, socketIds);
            }
        }

        // Gửi danh sách người dùng đang online về client
        emitOnlineUsers(io);
    },
    offline: (io, socket) => {
        // Kiểm tra dữ liệu
        const socketId = socket?.id;
        const accountId = socket.handshake.auth?.accountId;
        if (!io || !socketId || !accountId) return;

        // Người dùng chưa tồn tại trong map
        if (!userOnlines.has(accountId)) return;
        const socketIds = [...userOnlines.get(accountId)];

        const updated = socketIds.filter(id => id !== socketId);
        if (updated.length === 0) userOnlines.delete(accountId);
        else userOnlines.set(accountId, updated);

        // Gửi danh sách người dùng đang online về client
        emitOnlineUsers(io);
    },
    userOnlines
}