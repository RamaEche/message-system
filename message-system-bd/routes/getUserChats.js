const Users = require("../models/Users.js");
const Chats = require("../models/Chats.js");

const userChats = async (req, res)=>{
	const ids = req.user.Chats.Groups.concat(req.user.Chats.Users); 
	let chats = [];
	for (let i = 0; i < ids.length; i++){
		let currentChat = await Chats.findById(ids[i]).exec();
		let chatDescription;
		let name;
		let otherChat;
		let otherChatUserCurrentState;
		let ignoredMsgs = 0;

		if(currentChat.Messages.length != 0){chatDescription = currentChat.Messages[currentChat.Messages.length-1].TextMessage;}
		else{ chatDescription = "";}
      
		if(currentChat.Type == "G"){
			name = currentChat.Name;

			otherChatUserCurrentState = null;
		}else{
			currentChat.Users.forEach(currentUser => {
				if(currentUser.UserId != req.user.id){
					otherChat = Users.findById(currentUser.UserId).exec();
				}
			});
			otherChat = await otherChat;
			otherChatUserCurrentState = otherChat.PrivateData.CurrentState;
			name = otherChat.PrivateData.UserName;
		}

		for (let i = currentChat.Messages.length -1; i >= 0; i--) {
			let seen = false;
			currentChat.Messages[i].SeenById.forEach(j=>{
				if(j ==  req.user.id){
					seen = true;
				}
			});

			if(!(currentChat.Messages[i].SentById == req.user.id || seen)){
				ignoredMsgs++;
			}
		}

		chats.push({
			id: currentChat.id,
			Name:name,
			Type:currentChat.Type,
			Description:chatDescription,
			UserCurrentState:otherChatUserCurrentState,
			IgnoredMessageCounter:ignoredMsgs,
		});
	}
	res.status(200).json({chats});
};

module.exports = userChats;