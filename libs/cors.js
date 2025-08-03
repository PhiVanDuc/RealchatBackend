const cors = require('cors');

const corsOptions = {
    origin: ['http://localhost:3000', 'https://realchat-three.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
    credentials: true
};

module.exports = cors(corsOptions);