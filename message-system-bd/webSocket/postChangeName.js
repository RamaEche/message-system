require("dotenv").config();

const Chats = require("../models/Chats.js");
const Users = require("../models/Users.js");

const postChangeName = async (socket, data, user) => {
	let newUserRes = {};

	try {
		const chat = await Chats.findById(data.chatId);

		chat.Users.forEach(async (userChat, index)=>{
			try {
				if(userChat.UserId != user.id){
					await Users.findById(userChat.UserId);

					if(data.name.length >= 4 && data.name.length <= 15){
						userChat.Name = data.name;
						await Chats.findOneAndUpdate({ _id: data.chatId },
							{ $set: { [`Users.${index}`]: userChat } });
						socket.emit("postChangeName", { status:200, ok:true, name:newUserRes.name });
						return 0;
					}else{
						socket.emit("postChangeName", { status:500, ok:false, msg:"Request error." });
					}
				}
			} catch (err) {
				socket.emit("postChangeName", { status:500, error: "internalServerError" });
				console.error(err);
				return 0;
			}
		});
	} catch (err) {
		socket.emit("postChangeName", { status:500, error: "internalServerError" });
		console.error(err);
		return 0;
	}
};

module.exports = postChangeName;