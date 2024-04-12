const { WSclients } = require("./controllers/validateUserBySocket.js");
const Chats = require("../models/Chats.js");

const postNewMessage = async (socket, data, user) => {
	try{
		//Verify that the chat exists.
		const chat = await Chats.findById(data.chatId);

		//Check that the user has the permissions to post a message in the chat.
		for (let i = 0; i < chat.Users.length; i++) {
			if(chat.Users[i].UserId == user.id){
				if(chat.Users[i].Roll != "N" && chat.Users[i].Roll != "A"){
					throw new Error("Unprivileged user.");
				}
			} 
		}
        
		//Save message to chat database.
		const postedTime = new Date();
		let updatedChat;
		try{
			updatedChat = await Chats.findOneAndUpdate(
				{ _id: data.chatId },
				{
					$push: {
						"Messages": {
							MediaPath: "", // left
							MediaType: "", // left
							PublicationTime: postedTime,
							TextMessage: data.text,
							SeenById: [user.id], // left
							SentById: user.id // left
						}
					}
				},
				{ new: true }
			);
		}catch (err){
			socket.emit("postNewMessage", { status:403, error: "Invalid chat." });
			return 0;
		}

		//Send notification received by the server to the server sent event.
		socket.emit("postNewMessage", { status:201, error: "Created resource." });

		for (let i = 0; i < chat.Users.length; i++) {
			for (let j = 0; j < WSclients.length; j++) {
				if(WSclients[j].userId == chat.Users[i].UserId && WSclients[j].userId != user.id){
					WSclients[j].socket.emit("fromServerNewMessage", {
						chatId:data.chatId,

						id:updatedChat.Messages[updatedChat.Messages.length-1].id,
						MediaPath:"",
						MediaType:"",
						PublicationTime:postedTime,
						TextMessage:data.text,
						SeenById:[user.id],
						SentById:user.id,
						internalOrigin:false
					});
				}
			}

		}
	}catch (err){
		socket.emit({ status:403, error: "Invalid chat." });
		console.error(err);
	}
};

module.exports = postNewMessage;