const { Account, RoomMember } = require("../../db/models/index");
const { Op } = require("sequelize");

const response = require("../../utils/response");

const isValidData = async (data) => {
    const { roomId, ownId } = data || {};

     const result = {
        success: false,
        status: 400
    }

    if (!roomId || !ownId) {
        result.message = "Vui lòng cung cấp đủ dữ liệu!";
        return result;
    }

    result.status = 200;
    result.success = true;
    return result;
}

module.exports = async (req, res) => {
    try {
        const { roomId, ownId } = req.query || {};

        const isValid = await isValidData(req.query);
        if (!isValid.success) return response(res, isValid.status, isValid);

        const partner = await RoomMember.findOne({
            where: {
                room_id: roomId,
                account_id: {
                    [Op.not]: ownId
                }
            },
            include: {
                model: Account,
                as: "member",
                attributes: ["id", "display_name", "avatar"]
            }
        });

        return response(res, 200, {
            success: true,
            message: "Thành công lấy ra thông tin!",
            data: partner.member
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