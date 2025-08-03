const { Account, Room, RoomMember } = require("../../db/models/index");
const { Op } = require("sequelize");

const response = require("../../utils/response");
const isInteger = require("../../utils/is-integer");

const isValidData = async (data) => {
    const { ownId, page } = data || {};

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

    const ownAccount = await Account.findByPk(ownId);
    if (!ownAccount) {
        result.status = 404;
        result.message = "Không tìm thấy tài khoản!"
        return result;
    }

    result.success = true;
    result.status = 200;
    return result;
}

module.exports = async (req, res) => {
    try {
        const { ownId, page } = req.query || {};

        const isValid = await isValidData(req.query);
        if (!isValid.success) return response(res, isValid.status, isValid);

        const formatPage = Number(page);
        const offset = (formatPage - 1) * 10;

        const {count, rows: accounts} = await Account.findAndCountAll({
            where: {
                id: {
                    [Op.not]: ownId
                }
            },
            offset,
            limit: 10
        });

        const ownRooms = await RoomMember.findAll({
            where: { account_id: ownId },
            include: {
                model: Room,
                as: 'room',
                include: {
                    model: RoomMember,
                    as: 'members',
                    where: {
                        account_id: {
                            [Op.in]: accounts.map(acc => acc.id)
                        }
                    },
                    required: true
                }
            }
        });

        const accountToRoomMap = {};
        ownRooms.forEach(roomMember => {
            if (roomMember.room && roomMember.room.members) {
                roomMember.room.members.forEach(member => {
                    if (member.account_id !== ownId) {
                        accountToRoomMap[member.account_id] = roomMember.room.id;
                    }
                });
            }
        });

        const accountsWithRoom = accounts.map(account => {
            return {
                ...account.toJSON(),
                room_id: accountToRoomMap[account.id] || null
            };
        });

        const totalPage = Math.ceil(count / 10);
        const hasNextPage = formatPage < totalPage;

        return response(res, 200, {
            success: true,
            message: "Thành công lấy ra danh sách tài khoản!",
            data: {
                accounts: accountsWithRoom,
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