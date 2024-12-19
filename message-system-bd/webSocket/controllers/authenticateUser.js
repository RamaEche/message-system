const Chats = require("../../models/Chats.js");
const { validateUserBySocket } = require("./validateUserBySocket.js");

const authenticateUser = async (socket, emitTo, data, WSclients, user)=>{
	try{
		socket.emit("authenticateUser", { status:200, userId:user.id });
        
	}catch (err){
		socket.emit("authenticateUser", { status:403, error: "Valid Token But invalid user." });
		return 0;
	}

	try{
		let linkedUsers = [];
		user.Chats.Users.forEach(async userChatId=>{

			const currentChat = await Chats.findById(userChatId);
			const otherChatUserId = currentChat.Users.filter(chatUser => chatUser.UserId != user.id)[0].UserId;
            
			linkedUsers.push({ userId:otherChatUserId, commonChatId:userChatId });
               
			const validateRes = validateUserBySocket(otherChatUserId);
			if(validateRes){
				setTimeout(() => {
					validateRes.socket.emit("updateUserChatCurrentStatus", { state:true, chatId:userChatId });
					socket.emit("updateUserChatCurrentStatus", { state:true, chatId:userChatId });
				}, 1000);
			}

		});

		WSclients.push({socket, userId:user.id, linkedUsers});

	}catch(err){
		socket.emit("authenticateUser", { status:403, error: "Valid Token But invalid user." });
		return 0;
	}
};

module.exports = authenticateUser;