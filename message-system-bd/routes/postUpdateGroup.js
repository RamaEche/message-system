require("dotenv").config();

const Chats = require("../models/Chats.js");
const fs = require("fs/promises");
const { rmSync, readdirSync, unlinkSync } = require("fs");
const path = require("path");
const imageType = require("image-type");
const uploadFile = require("../controllers/uploadFile.js");
const deleteFile = require("../controllers/deleteFile.js");

const postUpdateGroup = async(req, res)=>{
	let chat = await Chats.findById(req.headers["chatid"]);
  
	let Imgbuffer;
	try{
		if(req.body){      
			if(req.body.Name != chat.Name && req.body.Name.length >= 4 && req.body.Name.length <= 20){ //Username change.
				try{
					await Chats.updateOne({_id:req.headers["chatid"]}, {$set:{"Name":req.body.Name}});
				}catch(err){
					throw new Error();
				}
			}else if(req.body.Name != chat.Name){
				throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
			}

			if(req.body.Description != chat.Description && req.body.Description.length >= 1 && req.body.Description.length <= 80){ //Username change.
				try{
					await Chats.updateOne({_id:req.headers["chatid"]}, {$set:{"Description":req.body.Description}});
				}catch(err){
					throw new Error();
				}
			}else if(req.body.Description != chat.Description){
				throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
			}

			if(req.body.ChatImage == "none"){
				await Chats.updateOne({_id:req.headers["chatid"]}, {$set:{"PhotoPath":null}});
				const folderPath = path.join(process.env.MEDIA_FILES, "chats", `chat-ID${req.headers["chatid"]}`);
				const filenames = readdirSync(folderPath);
				console.log(path.join(folderPath, filenames[0]));
				unlinkSync(path.join(folderPath, filenames[0]));
			}
		}
    

		console.log(req.file);
		if(req.file){
			const changeImage = async()=>{ //Image change.
				const currentChat = await Chats.findById(req.headers["chatid"]);
				const url = currentChat.PhotoPath;
				deleteFile(url, "mediaFiles/mediaFiles/chats/");

				const cloudRes = uploadFile(path.join(process.env.UPLOADS_FILES, req.file.filename), `mediaFiles/mediaFiles/chats/chat-ID${req.headers["chatid"]}`);
				await Chats.updateOne({_id:req.headers["chatid"]}, {$set:{"PhotoPath":cloudRes}});
			};

			Imgbuffer = await fs.readFile(path.join(process.env.UPLOADS_FILES, req.file.filename));
			const ImgType = imageType(Imgbuffer);
			if(!(ImgType && ImgType.mime === "image/jpeg")){
				rmSync(path.join(process.env.UPLOADS_FILES, req.file.filename));
				throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
			}

			if(chat.PhotoPath){
				try{
					const lastImage = await fs.readFile(chat.PhotoPath);
					if(lastImage != Imgbuffer){
						rmSync(chat.PhotoPath);
						changeImage();
					}
				}catch(err){
					throw new Error("{ \"ok\":false, \"status\":500, \"err\":\"impossibleImageUpdate\"}");
				}
			}else{
				changeImage();
			}
		}

		res.status(200).json({ok:true});
	}catch(err){
		try{
			const errorMessage = JSON.parse(err.message);
			res.status(errorMessage.status || 400).json(errorMessage);
		}catch{
			res.status(500).json({ok:false, state:500, msg:"internalServerError"});
		}
	}
};

module.exports = postUpdateGroup;