const Chats = require("../models/Chats.js");

const deleteMessage = async (socket, data, user) => {
	let chat;
	try{
		//Verify that the chat exists.
		chat = await Chats.findById(data.chatId);

	}catch (err){
		socket.emit("deleteMessage", { status:403, error: "invalidChat" });
		console.error(err);
		return 0;
	}

	try{
		//Verify that the user has the permissions to delete a message in the chat.
		for (let i = 0; i < chat.Users.length; i++) {
			if(chat.Users[i].UserId == user.id){
				if(chat.Users[i].Roll != "N" && chat.Users[i].Roll != "A"){
					throw new Error("Unprivileged user.");
				}else{
					//Check that the message to be deleted was posted by that user.
					if(user.id != chat.Messages.filter(msg => msg.id == data.messageId)[0].SentById){
						throw new Error("Unprivileged user.");
					}
				}
			} 
		}
	}catch (err){
		socket.emit("deleteMessage", { status:403, error: "unprivilegedUser" });
		console.error(err);
		return 0;
	}

	try {
		let result = await Chats.updateOne(
			{ "Messages._id": data.messageId },
			{ $pull: { Messages: { _id: data.messageId } } }
		);

		if (result.nModified < 1) {
			throw new Error("Invalid message id.");
		}
	} catch (err) {
		socket.emit("deleteMessage", { status:400, error: "invalidMessageId" });
		console.error(err);
		return 0;
	}

	socket.emit("deleteMessage", {status:200});
};

module.exports = deleteMessage;