require("dotenv").config();

const Users = require("../models/Users.js");
const Chats = require("../models/Chats.js");

//chatGroupImagePath is commented out because currently the client cannot select an image when creating the group.
const createComunicationChanel = async({type, name, description, usersID, /* chatGroupImagePath,  */nameOfOtherUser}, mainUserID)=>{  
	let chatUsers = [];
	let CCData;
	if(type == "G"){
		usersID.forEach(userId => {
			chatUsers.push({
				UserId:userId,
				Roll:"N"
			});
		});

		chatUsers.push({
			UserId:mainUserID,
			Roll:"A"
		});
		CCData = {
			Name:name,
			PhotoPath: "link",
			Description:description,
			Type: type,
			Messages: [],
			Users:chatUsers,
			MediaFolderPath: "MediaFolderPath..."
		};
	}else{
		usersID.forEach(userId => {
			chatUsers.push({
				UserId:userId,
				Name:nameOfOtherUser,
				Roll:"N"
			});
		});

		const mainUser = await Users.findById(mainUserID);
		chatUsers.push({
			UserId:mainUserID,
			Name:mainUser.PrivateData.UserName,
			Roll:"N"
		});
      
		CCData = {
			Type:type,
			Messages:[],
			Users:chatUsers,
			MediaFolderPath: "MediaFolderPath..."
		};
	}
  
	const newCC = await Chats.create(CCData);  
	if(newCC.Type == "G"){
		await Chats.updateOne({_id:newCC.id}, {$set:{ "PhotoPath":null}});
	}
  
	//Add to half time to remove in db
  
	newCC.Users.forEach(async u=>{
		const user = await Users.findById(u.UserId);
		if(newCC.Type == "G"){
			user.Chats.Groups.push(newCC.id);
			await Users.updateOne({_id:u.UserId}, {$set:{"Chats.Groups":user.Chats.Groups}});
		}
		else {
			user.Chats.Users.push(newCC.id);
			await Users.updateOne({_id:u.UserId}, {$set:{"Chats.Users":user.Chats.Users}});
		}
	});
};

module.exports = createComunicationChanel;