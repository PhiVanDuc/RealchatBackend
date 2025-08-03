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
        }, "1h");
        
        const refreshToken = generateToken({ id: account.id }, "7d");

        res.cookie('access-token', accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        res.cookie('refresh-token', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });

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