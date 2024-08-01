const Users = require("../models/Users.js");
const Chats = require("../models/Chats.js");

const postLeaveGroup = async (socket, data, user) => {
	try {
		const currentChat = await Chats.findById(data.chatId).exec();
		if(currentChat.Users.length == 0) throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"lastUser\"}");

		if(currentChat.Users.length == 1){
			socket.emit("postLeaveGroup", { status:400, error: "Invalid acction." });
			return 0;
		}

		let newUsers = [];
		let anyAdmin = false;
		currentChat.Users.forEach(({UserId, Roll})=>{
			if(UserId != user.id){
				newUsers.push({ UserId, Roll });
				if(Roll == "A"){
					anyAdmin = true;
				}
			}
		});

		if(!anyAdmin){
			newUsers[0].Roll = "A";
		}
		await Chats.updateOne({_id:data.chatId}, {$set:{"Users":newUsers}});

		const currentUsers = await Users.findById(user.id).exec();
		let newChatsGroups = [];
		currentUsers.Chats.Groups.forEach((value)=>{
			if(value != data.chatId){
				newChatsGroups.push(value);
			}
		});
		await Users.updateOne({_id:user.id}, {$set:{"Chats.Groups":newChatsGroups}});

		socket.emit("postLeaveGroup", { status:200, ok:true });
	} catch (err) {
		socket.emit("postLeaveGroup", { status:400, error: "Invalid message id." });
		console.error(err);
		return 0;
	}
};

module.exports = postLeaveGroup;