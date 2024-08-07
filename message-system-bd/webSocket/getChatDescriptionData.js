require("dotenv").config();

const Chats = require("../models/Chats.js");

const getChatDescriptionData = async (socket, data, user) => {
	try {
		const chat = await Chats.findById(data.chatId);

		if(data.chatType == "U"){
			chat.Users.forEach(async userChat=>{
				if(userChat.UserId != user.id){	
					socket.emit("getChatDescriptionData", {status:200, ok:true, name:userChat.Name, chatId:data.chatId});
				}
			});
		}else{
			socket.emit("getChatDescriptionData", {status:200, ok:true, name:chat.Name, chatId:data.chatId});
		}
	} catch (err) {
		socket.emit("getChatDescriptionData", { status:500, error: "internalServerError" });
		console.error(err);
		return 0;
	}
};

module.exports = getChatDescriptionData;