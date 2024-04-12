const Users = require("../models/Users.js");
const Chats = require("../models/Chats.js");
const fs = require("fs/promises");
const path = require("path");

const postDeleteGroup = async (socket, data) => {
	try {
		const currentChat = await Chats.findById(data.chatId).exec();
		let chatUsers = currentChat.Users;
    
		for (let i = 0; i < chatUsers.length; i++) {
			const currentUsers = await Users.findById(chatUsers[i].UserId).exec();
			let newChatsGroups = [];
			currentUsers.Chats.Groups.forEach((value)=>{
				if(value != data.chatId){
					newChatsGroups.push(value);
				}
			});
			await Users.updateOne({_id:chatUsers[i].UserId}, {$set:{"Chats.Groups":newChatsGroups}});
		}

		await Chats.deleteOne({_id: data.chatId});

		//Delete chat folder.
		const mediaFiles = path.join(process.env.MEDIA_FILES, "chats", `chat-ID${data.chatId}`);
		await fs.rm(mediaFiles, { recursive: true });

		socket.emit("postDeleteGroup", { status:200, ok:true });
	} catch (err) {
		socket.emit("postDeleteGroup", { status:400, error: "internalServerError" });
		console.error(err);
		return 0;
	}
};

module.exports = postDeleteGroup;