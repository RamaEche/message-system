const Chats = require("../models/Chats");
const createComunicationChanel = require("../controllers/createComunicationChanel");

const postCreateGroup = async (socket, data, user) => {
	try {
		let usersToAddById = [];
		for (let i = 0; i < data.chatsIdToAdd.length; i++) {
			const currentChatObj = await Chats.findById(data.chatsIdToAdd[i]).exec();
			usersToAddById.push(currentChatObj.Users.filter(currentUserId => currentUserId != user.id)[0].UserId);
		}
		createComunicationChanel({name:data.name, description:data.description, type:"G", usersID:usersToAddById}, user.id);
		socket.emit("postCreateGroup", { status:200, ok:true });

	} catch (err) {
		socket.emit("postCreateGroup", { status:500, error: "internalServerError" });
		console.error(err);
		return 0;
	}
};

module.exports = postCreateGroup;