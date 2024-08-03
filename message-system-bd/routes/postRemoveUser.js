require("dotenv").config();

const Users = require("../models/Users.js");
const Chats = require("../models/Chats.js");
const fs = require("fs/promises");
const path = require("path");

const postRemoveUser = async(req, res)=>{
	try{
		if(req.user.PrivateData.ProfilePhotoPath){
			try{
				let ProfilePhotoPathParts = req.user.PrivateData.ProfilePhotoPath.split("\\");
				ProfilePhotoPathParts.pop();
				ProfilePhotoPathParts = ProfilePhotoPathParts.join("\\");
				await fs.rm(ProfilePhotoPathParts, { recursive: true, force: true });
			}catch(err){
				throw new Error("{ \"ok\":false, \"status\":500, \"err\":\"impossibleRemoveAccount\"}");
			}
		}

		const ids = req.user.Chats.Groups.concat(req.user.Chats.Users); 
		for (let i = 0; i < ids.length; i++) {
			const currentChat = await Chats.findById(ids[i]);
			if(currentChat.Type == "U"){
				const otherUserId = currentChat.Users.find(i=>i.UserId != req.user.id).UserId;
				await Users.updateOne({_id:otherUserId}, { $pull: { "Chats.Users": ids[i]} });
				await Chats.deleteOne({_id:ids[i]});
			}else if(currentChat.Type == "G"){
				if(currentChat.Users.length == 1){
					//Delete chat folder.
					try{
						const mediaFiles = path.join(process.env.MEDIA_FILES, "chats", `chat-ID${ids[i]}`);
						await fs.rm(mediaFiles, { recursive: true });
					}catch{console.log();}
					await Chats.deleteOne({_id:ids[i]});
				}else{
					let newUsers = [];
					let anyAdmin = false;
					currentChat.Users.forEach(({UserId, Roll})=>{
						if(UserId != req.user.id){
							newUsers.push({ UserId, Roll });
							if(Roll == "A"){
								anyAdmin = true;
							}
						}
					});

					if(!anyAdmin){
						newUsers[0].Roll = "A";
					}

					await Chats.updateOne({_id:ids[i]}, {$set:{"Users":newUsers}});
				}
			}
			currentChat.Users;
		}

		await Users.findByIdAndDelete(req.user.id);
		console.log("Deleted account.");
		res.status(500).json({ok:true});
	}catch(err){
		console.error(err);
		try{
			const err=JSON.parse(err.message);
			res.status(err.status || 400).json(err);
		}catch{
			res.status(500).json({ok:false, state:500, msg:"Internal Server Error"});
		}
	}
};

module.exports = postRemoveUser;