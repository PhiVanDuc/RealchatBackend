const express = require('express');
const router = express.Router();

const {
    listAccount
} = require("../controllers/account/account.controller");

router.get("/", listAccount);

module.exports = router;
