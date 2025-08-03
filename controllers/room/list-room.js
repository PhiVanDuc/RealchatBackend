const { Account, Room, RoomMember, Message, sequelize } = require("../../db/models/index");
const { Op } = require("sequelize");

const response = require("../../utils/response");
const isInteger = require("../../utils/is-integer");

const isValidData = async (data) => {
    const { ownId, page } = data;

    const result = {
        success: false,
        status: 400
    }

    if (!ownId || !page) {
        result.message = "Vui lòng cung cấp đủ dữ liệu!";
        return result;
    }

    if (!isInteger(page)) {
        result.message = "Số trang cung cấp không hợp lệ!";
        return result;
    }

    result.status = 200;
    result.success = true;
    return result;
}

module.exports = async (req, res) => {
    try {
        const { ownId, page } = req.query || {};

        const isValid = await isValidData(req.query);
        if (!isValid.success) return response(res, isValid.status, isValid);

        const formatPage = Number(page);
        const offset = (formatPage - 1) * 10;

        const { count, rows: rooms } = await Room.findAndCountAll({
            include: [
                {
                    model: RoomMember,
                    as: "members",
                    where: { account_id: ownId }
                },
                {
                    model: Message,
                    as: 'messages',
                    where: { is_deleted: false },
                    attributes: [],
                    required: true
                }
            ],
            limit: 10,
            offset,
            order: [["updated_at", "DESC"]]
        });
        const roomIds = rooms.map(room => room.id);

        if (roomIds.length === 0) {
            return response(res, 200, {
                success: true,
                message: "Không có phòng chat nào!",
                data: {
                    rooms: [],
                    page: formatPage,
                    hasNextPage: false
                }
            });
        }

        const messages = await sequelize.query(`
            SELECT DISTINCT ON (room_id) *
            FROM "messages"
            WHERE room_id IN (:roomIds) AND is_deleted = false
            ORDER BY room_id, created_at DESC
            `,
            {
                replacements: { roomIds },
                model: Message,
                mapToModel: true
            }
        );

        const partners = await RoomMember.findAll({
            where: {
                room_id: roomIds,
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

        const formatPartners = partners.map(partner => ({
            room_id: partner.room_id,
            id: partner.member.id,
            display_name: partner.member.display_name,
            avatar: partner.member.avatar
        }))

        const formatRooms = rooms.map(room => {
            const message = messages.find(m => m.room_id === room.id);
            const partner = formatPartners.find(p => p.room_id === room.id);
            delete partner.room_id

            return {
                id: room.id,
                name: room.name,
                created_at: room.created_at,
                updated_at: room.updated_at,
                message: message || null,
                partner: partner || null
            };
        });

        const totalPage = Math.ceil(count / 10);
        const hasNextPage = formatPage < totalPage;

        return response(res, 200, {
            success: true,
            message: "Thành công lấy ra danh sách phòng chat!",
            data: {
                rooms: formatRooms,
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
        })
    }
}