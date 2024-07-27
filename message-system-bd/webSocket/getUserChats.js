const { validateUserBySocket } = require("./controllers/validateUserBySocket.js");
const Chats = require("../models/Chats.js");

const getUserChats = async (socket, data, user) => {
	try{
		const ids = user.Chats.Groups.concat(user.Chats.Users); 
		let chats = [];
		for (let i = 0; i < ids.length; i++){
			let currentChat = await Chats.findById(ids[i]).exec();
			let chatDescription;
			let otherChatUserCurrentState;
			let name;
			let ignoredMsgs = 0;
			let UserChatPerspectiveLinkId = null;

			if(currentChat.Messages.length != 0){chatDescription = currentChat.Messages[currentChat.Messages.length-1].TextMessage;}
			else{ chatDescription = "";}
		
			if(currentChat.Type == "G"){
				name = currentChat.Name;

				otherChatUserCurrentState = null;
			}else{
				let otherUserId;
				await currentChat.Users.forEach(async chatUser => {
					if(chatUser.UserId != user.id){
						name = chatUser.Name;
						UserChatPerspectiveLinkId = chatUser.UserId;
					}
				});

				if(validateUserBySocket(otherUserId)){
					otherChatUserCurrentState = true;
				}else{
					otherChatUserCurrentState = false;
				}
			}

			for (let i = currentChat.Messages.length -1; i >= 0; i--) {
			
				if(currentChat.Messages[i].SentById == user.id){
					break;
				}

				let seen = false;
				currentChat.Messages[i].SeenById.forEach(j=>{
					if(j ==  user.id){
						seen = true;
					}
				});

				if(!seen){
					ignoredMsgs++;
				}
			}

			chats.push({
				id: currentChat.id,
				UserChatPerspectiveLinkId,
				Name:name,
				Type:currentChat.Type,
				Description:chatDescription,
				UserCurrentState:otherChatUserCurrentState,
				IgnoredMessageCounter:ignoredMsgs,
			});
		}
		socket.emit("getUserChats", {status:200, chats});
	} catch (err) {
		socket.emit("getUserChats", { status:500, error: "internalServerError" });
		console.error(err);
		return 0;
	}
};

module.exports = getUserChats;