const { Account, Message, Room, RoomMember } = require("../../db/models/index");

const response = require("../../utils/response");
const { getIO } = require("../../libs/realtime/init");
const { userOnlines } = require("../../libs/realtime/activity-status");

const isValidData = (data) => {
    const { content, roomId, senderId } = data || {};

    const result = {
        success: false,
        status: 400
    }

    if (!content || !roomId || !senderId) {
        result.message = "Vui lòng cung cấp đủ dữ liệu!";
        return result;
    }

    result.status = 200;
    result.success = true;
    return result;
}

module.exports = async (req, res) => {
    try {
        const { content, repliedMessageId, roomId, tempId, senderId } = req.body || {};

        const isValid = isValidData(req.body);
        if (!isValid.success) return response(res, isValid.status, isValid);

        // Tin nhắn
        const message = await Message.create({
            content,
            room_id: roomId,
            sender_id: senderId,
            ...(repliedMessageId ? { replied_message_id: repliedMessageId } : {})
        });

        const fullMessage = await Message.findByPk(message.id, {
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

        const rawMessage = fullMessage.toJSON();
        rawMessage.temp_id = tempId;

        // Phòng chat
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

        room.changed("updated_at", true);
        await room.save();

        const rawRoom = room.toJSON();
        rawRoom.members = rawRoom.members.map(member => member.member);

        // Gửi sự kiện realtime
        const io = getIO();
        if (io) {
            const sender = rawRoom.members.find(member => member.id === senderId);
            const partner = rawRoom.members.find(member => member.id !== senderId);
            
            const senderSocketIds = userOnlines.get(sender.id) || [];
            const partnerSocketIds = userOnlines.get(partner.id) || [];

            if (partnerSocketIds.length > 0) io.to(partnerSocketIds).emit("message:new", { message: rawMessage });
            io.to([...senderSocketIds, ...partnerSocketIds]).emit("room:new-message", { room: { ...rawRoom, message: rawMessage } });
        }

        return response(res, 200, {
            success: true,
            message: "Thành công thêm tin nhắn!",
            data: rawMessage
        })
    }
    catch(error) {
        console.log(error);
        
        return response(res, 500, {
            success: false,
            message: "Lỗi server!"
        });
    }
}