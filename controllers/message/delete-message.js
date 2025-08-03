const { Account, Room, RoomMember, Message } = require("../../db/models/index");

const response = require("../../utils/response");
const { getIO } = require("../../libs/realtime/init");
const { userOnlines } = require("../../libs/realtime/activity-status");

const isValidData = async (messageId) => {
    const result = {
        success: false,
        status: 400
    }

    if (!messageId) {
        result.message = "Vui lòng cung cấp đủ dữ liệu!";
        return result;
    }

    result.status = 200;
    result.success = true;
    return result;
}

module.exports = async (req, res) => {
    try {
        const messageId = req.query?.messageId;

        const isValid = await isValidData(messageId);
        if (!isValid.success) return response(res, isValid.status, isValid);

        // Tin nhắn
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
        await message.update({ is_deleted: true });

        // Phòng chat
        const roomId = message.room_id;
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

            io.to(partnerSocketIds).emit("message:delete", { message });
            io.to([...senderSocketIds, ...partnerSocketIds]).emit("room:delete-message", { room: { ...rawRoom, message } });
        }

        return response(res, 200, {
            success: true,
            message: "Thành công xóa tin nhắn!",
            data: message
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