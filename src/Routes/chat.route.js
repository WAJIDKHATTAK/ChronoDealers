const express = require("express");
const router = express.Router();
const chatController = require("../Controllers/chat.controller");

router.post("/save", chatController.saveMessage);

module.exports = router;
