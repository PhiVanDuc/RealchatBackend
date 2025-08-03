const cors = require('cors');

const allowedOrigins = ['http://localhost:3000', 'https://realchat-three.vercel.app'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
    credentials: true
};

module.exports = cors(corsOptions);