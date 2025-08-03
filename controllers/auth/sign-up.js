const { Account } = require("../../db/models/index");

const bcrypt = require('bcrypt');
const response = require("../../utils/response");

const isValidData = async (data) => {
    const { displayName, name, password, confirmPassword } = data;

    const result = {
        success: false,
        status: 400
    }

    if (!displayName || !name || !password || !confirmPassword) {
        result.message = "Vui lòng cung cấp đủ dữ liệu!";
        return result;
    }

    if (password !== confirmPassword) {
        result.message = "Vui lòng nhập đúng mật khẩu xác nhận!";
        return result;
    }

    const account = await Account.findOne({ where: { name } });
    if (account) {
        result.message = "Tên tài khoản đã tồn tại!";
        return result;
    }

    result.success = true;
    result.status = 200;
    return result;
}

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
};

module.exports = async (req, res) => {
    try {
        const { displayName, name, password } = req.body;

        const isValid = await isValidData(req.body);
        if (!isValid.success) return response(res, isValid.status, isValid);

        const hashedPassword = await hashPassword(password);
        await Account.create({
            name,
            password: hashedPassword,
            display_name: displayName,
            avatar: `https://picsum.photos/seed/${name}/200`
        });

        return response(res, 200, {
            success: true,
            message: "Đã đăng kí tài khoản thành công!"
        })
    }
    catch(error) {
        return response(res, 500, {
            success: false,
            message: "Lỗi server!"
        });
    }
}