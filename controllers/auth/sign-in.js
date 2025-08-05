const { Account } = require("../../db/models/index");

const bcrypt = require('bcrypt');
const response = require("../../utils/response");
const { generateToken } = require("../../utils/jwt-token");

const isValidData = (data) => {
    const { name, password } = data;

    const result = {
        success: false,
        status: 400
    }

    if (!name || !password) {
        result.message = "Vui lòng cung cấp đủ dữ liệu!";
        return result;
    }

    result.success = true;
    result.status = 200;
    return result;
}

module.exports = async (req, res) => {
    try {
        const { name, password } = req.body;

        const isValid = isValidData(req.body);
        if (!isValid.success) return response(res, isValid.status, isValid);

        const account = await Account.findOne({
            where: { name }
        });

        if (!account) {
            return response(res, 401, {
                success: false,
                message: "Sai tài khoản hoặc mật khẩu!"
            });
        }

        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return response(res, 401, {
                success: false,
                message: "Sai tài khoản hoặc mật khẩu!"
            });
        }

        const data = {
            id: account.id,
            display_name: account.display_name,
            avatar: account.avatar
        }

        const accessToken = generateToken(data);
        const refreshToken = generateToken({ id: data.id }, "7d");

        return res.status(200).json({
            success: true,
            message: "Đã đăng nhập thành công!",
            data: {
                accessToken,
                refreshToken
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