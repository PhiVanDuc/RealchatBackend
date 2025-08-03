const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = "5s") => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return {
            valid: true,
            data: decoded,
        };
    }
    catch(error) {
        if (error.name === "TokenExpiredError") {
            return {
                valid: false,
                status: 410
            }
        }

        return {
            valid: false,
            status: 401
        }
    }
}

module.exports = {
    generateToken,
    verifyToken
};