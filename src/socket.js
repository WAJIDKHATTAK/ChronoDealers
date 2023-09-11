const chatService = require("./Services/chat.service");
const socketIo = require("socket.io");

const socketServer = {};

socketServer.init = (server) => {
	const io = socketIo(server, {
		cors: {
			origin: "http://localhost:3000",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		console.log("New Client Connected");

		socket.on("joinRoom", (chatId) => {
			console.log(`Joined room: ${chatId}`);
			socket.join(chatId);
		});

		socket.on("send_message", async (data) => {
			try{
			const { from, to, message } = data;
			const savedMessage = await chatService.saveMessage(
				from,
				to,
				message,
			);
			io.emit("new_message", savedMessage);

			const notifications = await chatService.saveNotification({
				message: `You have a new message from ${from}`,
				to,
				from,
			});

			io.emit("new_notification", notifications);
		}catch(error){
			console.log(error);
		}
		});

		socket.on("disconnect", () => {
			console.log("Client disconnected");
		});
	});
};

module.exports = { init: socketServer.init };

// frontend
// // ... existing imports and code

// useEffect(() => {
// 	// ... existing code for handling new messages

// 	socket.on('new_notification', (notification) => {
// 	  console.log('New notification received:', notification);
// 	  // You can update your UI here to show the notification
// 	});

// 	return () => {
// 	  // ... existing code
// 	  socket.off('new_notification');
// 	};
//   }, [messages]);

//   // ... existing code
