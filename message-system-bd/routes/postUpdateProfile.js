require("dotenv").config();

const Users = require("../models/Users.js");
const fs = require("fs/promises");
const { rmSync } = require("fs");
const path = require("path");
const imageType = require("image-type");

const updateProfile = async(req, res)=>{
	let Imgbuffer;
	try{
		if(req.body){      
			if(req.body.UserName != req.user.PrivateData.UserName && req.body.UserName.length >= 4 && req.body.UserName.length <= 15){ //username cambio
				try{
					await Users.updateOne({_id:req.user.id}, {$set:{"PrivateData.UserName":req.body.UserName}});
				}catch(err){
					throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"alreadyRegistered\"}");
				}
			}else if(req.body.UserName != 0){
				throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
			}
		}

		if(req.file){
			const changeImage = async()=>{ //imagen cambio
				const mediaFiles = path.join(process.env.MEDIA_FILES, "users", `user-ID${req.user.id}`);  
				fs.rename(path.join(process.env.UPLOADS_FILES, req.file.filename), path.join(mediaFiles, req.file.filename));
    
				await Users.updateOne({_id:req.user.id}, {$set:{"PrivateData.ProfilePhotoPath":path.join(mediaFiles, req.file.filename)}});
			};

			Imgbuffer = await fs.readFile(path.join(process.env.UPLOADS_FILES, req.file.filename));
			const ImgType = imageType(Imgbuffer);
			if(!(ImgType && ImgType.mime === "image/jpeg")){
				rmSync(path.join(process.env.UPLOADS_FILES, req.file.filename));
				throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
			}

			if(req.user.PrivateData.ProfilePhotoPath){
				try{
					const lastImage = await fs.readFile(req.user.PrivateData.ProfilePhotoPath);
					if(lastImage != Imgbuffer){
						rmSync(req.user.PrivateData.ProfilePhotoPath);
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

module.exports = updateProfile;