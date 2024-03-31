require("dotenv").config();

const Users = require("../models/Users.js");
const Chats = require("../models/Chats.js");

const getChatOptionData = async (socket, data, user) => {
	try {
		const chat = await Chats.findById(data.chatId);

		chat.Users.forEach(async userChat=>{
			if(userChat.UserId != user.id){
				let newUserRes = {};
				newUserRes.name = userChat.Name;
				const userGeted = await Users.findById(userChat.UserId);
				newUserRes.userName = "@"+userGeted.PrivateData.UserName;
				newUserRes.description = userGeted.PrivateData.Description;

				socket.emit("getChatOptionData", {status:200, ok:true, userName:newUserRes.userName, name:newUserRes.name, description:newUserRes.description});
			}
		});
	} catch (err) {
		socket.emit("getChatOptionData", { status:500, error: "internalServerError" });
		console.error(err);
		return 0;
	}
};

module.exports = getChatOptionData;