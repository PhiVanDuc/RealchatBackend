const { verifyToken } = require("../utils/jwt-token");
const response = require("../utils/response");

module.exports = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        if (!accessToken) {
            return response(res, 401, {
                success: false,
                message: "Chưa xác thực!"
            })
        }

        const verify = verifyToken(accessToken);
        
        if (!verify.valid && verify.status === 401) {
            return response(res, 401, {
                success: false,
                message: "Chưa xác thực!"
            })
        }
        else if (!verify.valid && verify.status === 410) {
            console.log("Phiên đăng nhập đã hết hạn!");

            return response(res, 410, {
                success: false,
                message: "Phiên đăng nhập đã hết hạn!"
            })
        }

        next();
    }
    catch(error) {
        console.log(error);

        return response(res, 500, {
            success: false,
            message: "Lỗi server!"
        });
    }
}