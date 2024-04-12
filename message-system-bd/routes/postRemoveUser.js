require("dotenv").config();

//const Users = require("../models/Users.js");
//const fs = require("fs/promises");

const postRemoveUser = async(req, res)=>{
	console.log("Deleted account.");
	res.status(500).json({ok:true});

/* 	let Imgbuffer;
	try{
		if(req.user.PrivateData.ProfilePhotoPath){
			try{
				ProfilePhotoPathParts = req.user.PrivateData.ProfilePhotoPath.split("\\")[req.user.PrivateData.ProfilePhotoPath.length -1];
				ProfilePhotoPathParts.pop(ProfilePhotoPathParts[ProfilePhotoPathParts.length - 1]);
				await fs.rmSync(ProfilePhotoPathParts, { recursive: true, force: true });
			}catch(err){
				throw new Error("{ \"ok\":false, \"status\":500, \"err\":\"impossibleRemoveAccount\"}");
			}
		}

		await Users.findByIdAndDelete(req.user.id);
	}catch(err){
		console.error(err);
		try{
			err=JSON.parse(err.message);
			res.status(err.status || 400).json(err);
		}catch{
			res.status(500).json({ok:false, state:500, msg:"Internal Server Error"});
		}
	} */
};

module.exports = postRemoveUser;