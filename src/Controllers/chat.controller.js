const chatService = require("../Services/chat.service");

const saveMessage = async (req, res) => {
  const { from, to, message } = req.body;
  console.log(req.body)
  const savedMessage = await chatService.saveMessage(from, to, message);
  res.status(201).json(savedMessage);
};

module.exports = {
  saveMessage,
};
