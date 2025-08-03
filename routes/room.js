const express = require('express');
const router = express.Router();

const {
    listRoom,
    createRoom
} = require("../controllers/room/room.controller");

router.get("/", listRoom);
router.post("/", createRoom);

module.exports = router;
