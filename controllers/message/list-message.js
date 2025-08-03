const { Account, Message } = require("../../db/models/index");

const response = require("../../utils/response");
const isInteger = require("../../utils/is-integer");

const isValidData = async (data) => {
    const { roomId, page } = data;

    const result = {
        success: false,
        status: 400
    }

    if (!roomId || !page) {
        result.message = "Vui lòng cung cấp đủ dữ liệu!";
        return result;
    }

    if (!isInteger(page)) {
        result.message = "Phân trang sai định dạng!";
        return result;
    }

    result.status = 200;
    result.success = true;
    return result;
}

module.exports = async (req, res) => {
    try {
        const { roomId, page } = req.query || {};

        const isValid = await isValidData(req.query);
        if (!isValid.success) return response(res, isValid.status, isValid);

        const formatPage = Number(page);
        const limit = 20;
        const offset = (page - 1) * limit;

        const { count, rows: messages } = await Message.findAndCountAll({
            where: { room_id: roomId, is_deleted: false },
            include: [
                {
                    model: Account,
                    as: "sender",
                    attributes: ["id", "display_name", "avatar"]
                },
                {
                    model: Message,
                    as: "replied_message",
                    include: {
                        model: Account,
                        as: "sender",
                        attributes: ["id", "display_name", "avatar"]
                    }
                }
            ],
            order: [['created_at', 'DESC']],
            limit,
            offset
        });

        const reversedMessages = messages.reverse(); 

        const totalPage = Math.ceil(count / limit);
        const hasNextPage = formatPage < totalPage;

        return response(res, 200, {
            success: true,
            message: "Thành công lấy ra danh sách tin nhắn!",
            data: {
                messages: reversedMessages,
                page: formatPage,
                hasNextPage
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