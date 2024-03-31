const Users = require("../models/Users");
const createComunicationChanel = require("../controllers/createComunicationChanel");

const postAddUser = async (socket, data, user) => {
	try {
		let chatInCommon = false;
		const otherUser = await Users.findById(data.id);
		user.Chats.Users.forEach(mainChatId => {
			otherUser.Chats.Users.forEach(otherChatId => {
				if(mainChatId == otherChatId){
					chatInCommon = true;
				}
			});
		});
		if(chatInCommon) socket.emit("postAddUser", { status:400, error: "chatInCommon" });

		createComunicationChanel({type:"U", usersID:[data.id], nameOfOtherUser:data.name}, user.id);
		socket.emit("postAddUser", { status:200, ok:true });

	} catch (err) {
		socket.emit("postAddUser", { status:500, error: "internalServerError" });
		console.error(err);
		return 0;
	}
};

module.exports = postAddUser;