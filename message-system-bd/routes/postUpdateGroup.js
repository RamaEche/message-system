require("dotenv").config();

const Chats = require("../models/Chats.js");
const fs = require("fs/promises");
const { rmSync } = require("fs");
const path = require("path");
const imageType = require("image-type");

const postUpdateGroup = async(req, res)=>{
	let chat = await Chats.findById(req.headers["chatid"]);
  
	let Imgbuffer;
	try{
		if(req.body){      
			if(req.body.Name != chat.Name && req.body.Name.length >= 4 && req.body.Name.length <= 20){ //name cambio
				try{
					await Chats.updateOne({_id:req.headers["chatid"]}, {$set:{"Name":req.body.Name}});
				}catch(err){
					throw new Error();
				}
			}else if(req.body.Name != chat.Name){
				throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
			}

			if(req.body.Description != chat.Description && req.body.Description.length >= 1 && req.body.Description.length <= 80){ //name cambio
				try{
					await Chats.updateOne({_id:req.headers["chatid"]}, {$set:{"Description":req.body.Description}});
				}catch(err){
					throw new Error();
				}
			}else if(req.body.Description != chat.Description){
				throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
			}
		}
    

		console.log(req.file);
		if(req.file){
			const changeImage = async()=>{ //imagen cambio
				const mediaFiles = path.join(process.env.MEDIA_FILES, "chats", `chat-ID${req.headers["chatid"]}`);  
				fs.rename(path.join(process.env.UPLOADS_FILES, req.file.filename), path.join(mediaFiles, req.file.filename));
    
				await Chats.updateOne({_id:req.headers["chatid"]}, {$set:{"PhotoPath":path.join(mediaFiles, req.file.filename)}});
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