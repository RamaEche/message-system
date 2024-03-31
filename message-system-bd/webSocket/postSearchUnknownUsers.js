const Users = require("../models/Users.js");
const JsSearch = require("js-search");

const postSearchUnknownUsers = async (socket, data, user) => {
	try{
		let unOrdedCurrentUsers = (await Users.find().exec()).sort(function (a, b) {
			a.Name = a.PrivateData.UserName.toLowerCase();
			b.Name = b.PrivateData.UserName.toLowerCase();
    
			if (a.Name > b.Name) {
				return 1;
			}
			if (a.Name < b.Name) {
				return -1;
			}
			return 0;
		});
    
		unOrdedCurrentUsers = unOrdedCurrentUsers.filter((unOrdedCurrentUser)=>unOrdedCurrentUser.id != user.id);
		let currentUsers = unOrdedCurrentUsers;
    
		var search = new JsSearch.Search("isbn");
		search.addIndex(["PrivateData", "UserName"]);
		search.addDocuments(unOrdedCurrentUsers);
		let middleChat = search.search(data.inputValue.toLowerCase());
    
		let middleChatPos = 0;
		if(middleChat && middleChat.length != 0) middleChatPos = unOrdedCurrentUsers.findIndex((element) => element.id == middleChat.id);
    
		if(middleChatPos != 0){
			let differentChats = unOrdedCurrentUsers.slice(0, middleChatPos);
			unOrdedCurrentUsers = unOrdedCurrentUsers.slice(middleChatPos, unOrdedCurrentUsers.length);
			currentUsers = unOrdedCurrentUsers.concat(differentChats.reverse());
		}
    
		let arrayToSend = [];
		let chatInCommon = false;
		currentUsers.map((currentUser)=>{
			for (let i = 0; i < currentUser.Chats.Users.length; i++) {
				for (let j = 0; j < user.Chats.Users.length; j++) {
					if(currentUser.Chats.Users[i] == user.Chats.Users[j]){
						chatInCommon = true;
						break;
					}
				}
				if(chatInCommon) break;
			}
			if(!chatInCommon) arrayToSend.push({id:currentUser.id, userName:currentUser.PrivateData.UserName, userDescription:currentUser.PrivateData.Description});
			chatInCommon = false;
		});
		socket.emit("postSearchUnknownUsers", { status:200, arrayToSend });
	}catch (err){
		socket.emit("postSearchUnknownUsers", { status:403, error: "Invalid chat." });
		console.error(err);
	}
};

module.exports = postSearchUnknownUsers;