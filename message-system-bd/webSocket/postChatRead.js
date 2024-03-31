const validateInWSSystem = require("./controllers/validateInWSSystem");
const Chats = require("../models/Chats.js");

const postChatRead = async (socket, data)=>{
	try{
		let validatedData = await validateInWSSystem(socket, "postChatRead", data);
		if (validatedData == 0) return 0;
		let [userId] = validatedData;

		const chat = await Chats.findById(data.chatId);
		for (let i = chat.Messages.length; i > 0; i--) {
			const a = chat.Messages[i-1].SeenById.filter(id=>id == userId)[0];
			if(a == undefined){
				chat.Messages[i-1].SeenById.push(userId);
			}else{
				break;
			}
		}
		await Chats.replaceOne({_id:data.chatId}, chat);
	} catch (err) {
		socket.emit("postChatRead", { status:400, error: "internalServerError" });
		console.error(err);
		return 0;
	}
};

module.exports = postChatRead;