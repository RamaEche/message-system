require("dotenv").config();

const Users = require("../models/Users.js");
const Chats = require("../models/Chats.js");
const getGroupOptionData = async (socket, data, user) => {
	try {
		const chat = await Chats.findById(data.ChatId);

		chat.Users.forEach(async userChat=>{
			if(userChat.UserId != user.id){
				let newUserRes = {};
				newUserRes.name = user.Name;
				const userGeted = await Users.findById(userChat.UserId);
				newUserRes.userName = "@"+userGeted.PrivateData.UserName;
				newUserRes.description = userGeted.PrivateData.Description;

				socket.emit("getGroupOptionData", {status:200, ok:true, name:chat.Name, description:chat.Description, users:chat.Users});
			}
		});
	} catch (err) {
		socket.emit("getGroupOptionData", { status:500, error: "internalServerError" });
		console.error(err);
		return 0;
	}
};

module.exports = getGroupOptionData;