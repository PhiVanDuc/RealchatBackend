const { Account, Room, RoomMember, Message } = require("../../db/models/index");

const response = require("../../utils/response");
const { getIO } = require("../../libs/realtime/init");
const { userOnlines } = require("../../libs/realtime/activity-status");

const isValidData = async (data) => {
    const { roomId, messageId, senderId } = data || {};

    const result = {
        success: false,
        status: 400
    };

    if (!roomId || !messageId || !senderId) {
        result.message = "Vui lòng cung cấp đủ dữ liệu!";
        return result;
    }

    result.success = true;
    result.status = 200;
    return result;
}

module.exports = async (req, res) => {
    try {
        const { roomId, messageId, senderId } = req.body || {};

        const isValid = await isValidData(req.body);
        if (!isValid.success) return response(res, isValid.status, isValid);

        await Message.update(
            { is_read: true },
            { where: { id: messageId } },
        )

        const message = await Message.findByPk(messageId, {
            include: [
                {
                    model: Account,
                    as: 'sender',
                    attributes: ['id', 'display_name', 'avatar']
                },
                {
                    model: Message,
                    as: "replied_message",
                    include: {
                        model: Account,
                        as: 'sender',
                        attributes: ['id', 'display_name', 'avatar']
                    }
                }
            ]
        });

        const room = await Room.findByPk(roomId, {
            include: {
                model: RoomMember,
                as: "members",
                include: {
                    model: Account,
                    as: "member",
                    attributes: ['id', 'display_name', 'avatar']
                }
            }
        });

        const rawRoom = room.toJSON();
        rawRoom.members = rawRoom.members.map(member => member.member);

        // Gửi sự kiện realtime
        const io = getIO();
        if (io) {
            const senderId = message.sender_id;
            const sender = rawRoom.members.find(member => member.id === senderId);
            const partner = rawRoom.members.find(member => member.id !== senderId);
            
            const senderSocketIds = userOnlines.get(sender.id) || [];
            const partnerSocketIds = userOnlines.get(partner.id) || [];

            if (senderSocketIds.length > 0) io.to(senderSocketIds).emit("message:read", { message });
            if (partnerSocketIds.length > 0) io.to(partnerSocketIds).emit("room:read-message", { room: { ...rawRoom, message } });
        }

        return response(res, 200, {
            success: true,
            message: "Thành công đọc tin nhắn!",
            data: {
                message,
                room: { ...rawRoom, message }
            }
        });
    }
    catch(error) {
        console.log(error);
        
        return response(res, 500, {
            success: false,
            message: "Lỗi server!"
        });
    }
}