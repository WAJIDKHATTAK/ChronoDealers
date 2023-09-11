const Chat = require("../Models/chat.model");
const Notification = require("../Models/notification.model");
const saveMessage = async (from, to, message) => {
  const chat = new Chat({
    from,
    to,
    message,
  });
  await chat.save();
  return chat;
};

const saveNotification = async (from , message ,to) => {
	console.log('New notification received:' ,from , message , to);
	console.log("hello notifications")
 const notififcation = new Notification({
	type: "new_message",
    message,
    from,
    to,
    isRead: false,
 });
 await notififcation.save();
 return notififcation;
}
module.exports = {
  saveMessage,
  saveNotification
};
