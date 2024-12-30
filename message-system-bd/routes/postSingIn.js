require("dotenv").config();

const bcrypt = require("bcryptjs");
const fs = require("fs/promises");
const path = require("path");
const Users = require("../models/Users.js");
const createToken = require("../controllers/createToken.js");
const imageType = require("image-type");
const { rmSync } = require("fs");
const uploadFile = require("../controllers/uploadFile.js");

const singIn = async(req, res)=>{
	try{
		if(req.file){
			const Imgbuffer = await fs.readFile(path.join(process.env.TMPDIR, req.file.filename));
			const ImgType = imageType(Imgbuffer);
			if(!(ImgType && ImgType.mime === "image/jpeg")){
				await rmSync(path.join(process.env.TMPDIR, req.file.filename));
				throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
			}
		}

		let newUserRes;
    
		if(!(req.body && req.body.UserName && req.body.ValidatePasword && req.body.Password &&
			req.body.UserName.length >= 4 && req.body.UserName.length <= 15 &&
			req.body.ValidatePasword.length >= 5 && req.body.ValidatePasword.length <= 20 &&
			req.body.Password.length >= 5 && req.body.Password.length <= 20 &&
			req.body.Description.length <= 100)){
			throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
		}

		if(!(req.body.Password === req.body.ValidatePasword)){ throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"diferentPassword\"}");}
    
		const user = await Users.find({"PrivateData.UserName":req.body.UserName});
		if(user.length != 0){throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"alreadyRegistered\"}");}
    
		const salt = await bcrypt.genSalt(10);
		const passwordHashed = await bcrypt.hash(req.body.Password, salt);

		let description = "";
		if(req.body.Description){
			description = req.body.Description;
		}
		await Users.create({
			PrivateData:{
				Password: passwordHashed,
				UserName: req.body.UserName,
				Description: description,
				ProfilePhotoPath: "",
				ProfileState: "Active"
			},
			Chats: {
				Users: [],
				Groups: []
			}
		});

		const newUser = await Users.find({"PrivateData.UserName":req.body.UserName});
		if(newUser && newUser.length != 0){
			const token = createToken({UserID:newUser[0].id});
			newUserRes = {
				serverRes:{ok:true, token:token},
				UserID:newUser[0].id
			};
		}
    
		if(req.file){
			const userID = newUserRes.UserID;
			const cloudRes = await uploadFile(path.join(process.env.TMPDIR, req.file.filename), `mediaFiles/mediaFiles/users/user-ID${userID}`);
			await Users.updateOne({_id:userID}, {$set:{"PrivateData.ProfilePhotoPath":cloudRes}});
		}
		res.status(201).json(newUserRes.serverRes);
	}catch(err){
		try{
			const errorMessage = JSON.parse(err.message);
			res.status(errorMessage.status || 400).json(errorMessage);
		}catch{
			res.status(500).json({ok:false, state:500, msg:"internalServerError"});
		}
	}
};

module.exports = singIn;