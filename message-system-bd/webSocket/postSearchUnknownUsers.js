const Users = require("../models/Users.js");
const JsSearch = require("js-search");

const postSearchUnknownUsers = async (socket, data, user) => {
	try{
		if (data.inputValue == null || data.inputValue == ""){
			socket.emit("postSearchUnknownUsers", { status:200, arrayToSend:[] });
			return;
		}

		let unOrdedCurrentUsers = await Users.find().exec();

		unOrdedCurrentUsers = unOrdedCurrentUsers.filter((unOrdedCurrentUser)=>unOrdedCurrentUser.id != user.id);

		unOrdedCurrentUsers.forEach((currentUser) => {
			if (currentUser.PrivateData && currentUser.PrivateData.UserName) {
				currentUser.PrivateData.UserName = currentUser.PrivateData.UserName.toLowerCase();
			}
		});

		unOrdedCurrentUsers.map(u=>{
			console.log(u.PrivateData.UserName);
		});

		var search = new JsSearch.Search("id");
		search.addIndex(["PrivateData", "UserName"]);
		search.addDocuments(unOrdedCurrentUsers);
		let middleChat = search.search(data.inputValue.toLowerCase());

		console.log(middleChat);
		let arrayToSend = [];
		let chatInCommon = false;
		middleChat.map((currentUser)=>{
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