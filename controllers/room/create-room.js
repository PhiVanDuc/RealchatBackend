const { Room, RoomMember, sequelize } = require("../../db/models/index");
const response = require("../../utils/response");

const isValidData = async (data) => {
    const { ownId, partnerId } = data || {};

    const result = {
        success: false,
        status: 400
    }

    if (!ownId || !partnerId || ownId === partnerId) {
        result.message = "Vui lòng cung cấp đủ dữ liệu!";
        return result;
    }

    result.status = 200;
    result.success = true;
    return result;
}

module.exports = async (req, res) => {
    try {
        const { ownId, partnerId } = req.body || {};

        const isValid = await isValidData(req.body);
        if (!isValid.success) return response(res, isValid.status, isValid);

        const sameRoom = await Room.findOne({
            where: sequelize.literal(`
                (SELECT COUNT(DISTINCT account_id) 
                FROM room_members 
                WHERE room_id = "Room".id 
                    AND account_id IN (${sequelize.escape(ownId)}, ${sequelize.escape(partnerId)})
                ) = 2
            `)
        });

        if (!sameRoom) {
            const newRoom = await Room.create();

            await RoomMember.bulkCreate([
                {room_id: newRoom.id, account_id: ownId},
                {room_id: newRoom.id, account_id: partnerId}
            ]);

            return response(res, 200, {
                success: true,
                message: "Thành công tạo phòng chat!",
                data: newRoom
            });
        }

        return response(res, 200, {
            success: true,
            message: "Đã có phòng chat chung!",
            data: sameRoom
        });
    }
    catch(error) {
        console.log(error);
        
        return response(res, 500, {
            success: false,
            message: 'Lỗi server!'
        })
    }
}