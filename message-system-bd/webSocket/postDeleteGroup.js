const Users = require("../models/Users.js");
const Chats = require("../models/Chats.js");

const postDeleteGroup = async (socket, data, user) => {
	try {
		const currentChat = await Chats.findById(data.chatId).exec();
		let chatUsers = currentChat.Users;

		if(currentChat.Users && currentChat.Users.find(i=>i.UserId == user.id).Roll != "A"){
			socket.emit("postDeleteGroup", { status:400, error: "Invalid acction." });
			return 0;
		}
    
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

		socket.emit("postDeleteGroup", { status:200, ok:true });
	} catch (err) {
		socket.emit("postDeleteGroup", { status:400, error: "internalServerError" });
		console.error(err);
		return 0;
	}
};

module.exports = postDeleteGroup;