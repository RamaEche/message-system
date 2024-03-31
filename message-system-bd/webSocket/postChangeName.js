require("dotenv").config();

const Chats = require("../models/Chats.js");
const Users = require("../models/Users.js");

const postChangeName = async (socket, data, user) => {
	let newUserRes = {};

	try {
		const chat = await Chats.findById(data.chatId);

		chat.Users.forEach(async (userChat, index)=>{
			if(userChat.UserId != user.id){
				await Users.findById(userChat.UserId);

				if(data.name != userChat.Name && (data.name.length >= 4 && data.name.length <= 15) ){
					userChat.Name = data.name;
					await Chats.findOneAndUpdate({ _id: data.chatId },
						{ $set: { [`Users.${index}`]: userChat } });
					socket.emit("postChangeName", { status:200, ok:true, name:newUserRes.name });
				}else{
					throw new Error({ok:false, state:500, msg:"Internal Server Error"});
				}
			}
		});
	} catch (err) {
		socket.emit("postChangeName", { status:500, error: "internalServerError" });
		console.error(err);
		return 0;
	}
};

module.exports = postChangeName;