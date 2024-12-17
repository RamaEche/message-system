require("dotenv").config();

const Chats = require("../models/Chats");
const Users = require("../models/Users");

const getChatPhotoById = async(req, res)=>{
	try{
		let photoPath;

		const currentChat = await Chats.findById(req.headers.chatid);
		if(currentChat.Type == "G"){
			photoPath = currentChat.PhotoPath;
		}else{
			let usersID = [];
			await currentChat.Users.forEach(async c=>{
				usersID.push(c.UserId);
			});

			for (let a = 0; a < usersID.length; a++) {
				if(usersID[a] != req.user.id){
					const currentUser = await Users.findById(usersID[a]);
					photoPath = currentUser.PrivateData.ProfilePhotoPath;
				}
			}
		}

		try{
			res.status(200).json({ok:true, state:200, msg:photoPath});
		}catch (err){
			res.status(500).json({ok:false, state:500, msg:"noImage"});
		}
	}catch(err){
		try{
			const errorMessage = JSON.parse(err.message);
			res.status(errorMessage.status || 400).json(errorMessage);
		}catch{
			res.status(500).json({ok:false, state:500, msg:"internalServerError"});
		}
	}
};

module.exports = getChatPhotoById;