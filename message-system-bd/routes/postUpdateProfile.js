require("dotenv").config();

const Users = require("../models/Users.js");
const fs = require("fs/promises");
const { rmSync, readdirSync, unlinkSync } = require("fs");
const path = require("path");
const imageType = require("image-type");
const uploadFile = require("../controllers/uploadFile.js");
const deleteFile = require("../controllers/deleteFile.js");

const updateProfile = async(req, res)=>{
	let Imgbuffer;
	try{
		if(req.body){      
			if(req.body.UserName != req.user.PrivateData.UserName && req.body.UserName.length >= 4 && req.body.UserName.length <= 15){ //Username change.
				try{
					await Users.updateOne({_id:req.user.id}, {$set:{"PrivateData.UserName":req.body.UserName}});
				}catch(err){
					throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"alreadyRegistered\"}");
				}
			}else if(req.body.UserName != req.user.PrivateData.UserName){
				throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
			}

			if(req.body.Description != req.user.PrivateData.Description && req.body.Description.length >= 1 && req.body.Description.length <= 100){ //Description change.
				await Users.updateOne({_id:req.user.id}, {$set:{"PrivateData.Description":req.body.Description}});
			}else if(req.body.Description != req.user.PrivateData.Description){
				throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
			}

			if(req.body.ProfileImage == "none"){
				await Users.updateOne({_id:req.user.id}, {$set:{"PrivateData.ProfilePhotoPath":null}});
				const folderPath = path.join(process.env.MEDIA_FILES, "users", `user-ID${req.user.id}`);
				const filenames = readdirSync(folderPath);
				unlinkSync( path.join(folderPath, filenames[0]));
			}
		}

		if(req.file){
			const changeImage = async()=>{ //Image change.
				const currentUser = await Users.findById(req.user.id);
				const url = currentUser.PrivateData.ProfilePhotoPath;
				deleteFile(url, "mediaFiles/mediaFiles/users/");

				const cloudRes = await uploadFile(path.join(process.env.UPLOADS_FILES, req.file.filename), `mediaFiles/mediaFiles/users/user-ID${req.user.id}`);
				await Users.updateOne({_id:req.user.id}, {$set:{"PrivateData.ProfilePhotoPath":cloudRes}});
			};

			Imgbuffer = await fs.readFile(path.join(process.env.UPLOADS_FILES, req.file.filename));
			const ImgType = imageType(Imgbuffer);
			if(!(ImgType && ImgType.mime === "image/jpeg")){
				rmSync(path.join(process.env.UPLOADS_FILES, req.file.filename));
				throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
			}

			if(req.user.PrivateData.ProfilePhotoPath){
				try{
					changeImage();
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