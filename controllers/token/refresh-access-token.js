const { Account } = require("../../db/models/index");

const response = require("../../utils/response");
const { generateToken, verifyToken } = require("../../utils/jwt-token");

module.exports = async (req, res) => {
    try {
        const { refreshToken: refreshTokenReq } = req.body || {};
        
        if (!refreshTokenReq) {
            return response(res, 401, {
                success: false,
                message: "Chưa xác thực!"
            });
        }

        const verify = verifyToken(refreshTokenReq);
        if (!verify.valid) {
            return response(res, 401, {
                success: false,
                message: "Chưa xác thực!"
            });
        }

        const account = await Account.findByPk(
            verify.data.id,
            { attributes: ["id", "display_name", "avatar"] }
        );

        if (!account) {
            return response(res, 401, {
                success: false,
                message: "Chưa xác thực!"
            });
        }

        const accessToken = generateToken({
            id: account.id,
            display_name: account.display_name,
            avatar: account.avatar
        });
        
        const refreshToken = generateToken({ id: account.id }, "7d");

        return response(res, 200, {
            success: true,
            message: "Làm mới phiên đăng nhập thành công!",
            data: {
                accessToken,
                refreshToken
            }
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