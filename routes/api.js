const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const authRouter = require("./auth");
const tokenRouter = require("./token");

const accountRouter = require("./account");
const roomRouter = require("./room");
const messageRouter = require("./message");

router.get('/', function(req, res, next) {
  res.send('<h1>Realchat API</h1>');
});

router.use("/auth", authRouter);
router.use("/token", tokenRouter);

const privateRouter = express.Router();
privateRouter.use(authMiddleware);
privateRouter.use("/accounts", accountRouter);
privateRouter.use("/rooms", roomRouter);
privateRouter.use("/messages", messageRouter);

router.use("/", privateRouter);

module.exports = router;
