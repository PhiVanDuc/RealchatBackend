const express = require('express');
const router = express.Router();

const {
    createMessage,
    listMessage,
    partnerMessage,
    readMessage,
    deleteMessage
} = require("../controllers/message/message");

router.get("/", listMessage);
router.get("/partner", partnerMessage);

router.post("/", createMessage);
router.put("/read", readMessage);

router.delete("/", deleteMessage);

module.exports = router;
