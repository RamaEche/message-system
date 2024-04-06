require("dotenv").config();

const Chats = require("../models/Chats");
const { readdir } = require("fs/promises");
const path = require("path");

const getChatPhotoById = async(req, res)=>{
	try{
		let dir;
		let fileName;
		let files;
		const currentChat = await Chats.findById(req.headers.chatid);
		if(currentChat.Type == "G"){
			dir = path.join(process.env.MEDIA_FILES, "chats", `chat-ID${req.headers.chatid}`);

			try{
				files = await readdir(dir);
			}catch(err){
				throw new Error();
			}

			files.map((element, i) => {
				if(element.startsWith("ChatImage-")){
					fileName = files[i];
				}
			});
		}else{
			currentChat.Users.forEach(c=>{
				if(c.UserId != req.user.id) dir = path.join(process.env.MEDIA_FILES, "users", `user-ID${c.UserId}`);
			});

			try{
				files = await readdir(dir);
			}catch(err){
				throw new Error();
			}

			files.map((element, i) => {
				if(element.startsWith("ProfileImage-"))fileName = files[i];
			});
		}

		let options = {
			root: dir,
			dotfiles: "deny",
			headers: {
				"x-timestamp": Date.now(),
				"x-sent": true
			}
		};

		try{
			res.sendFile(fileName, options, function (err) {
				if (err) {
					console.log(err);
				}
			});
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