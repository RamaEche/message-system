require("dotenv").config();

const Users = require("../models/Users");

const getUserPhotoById = async(req, res)=>{
	try{
		const currentUser = await Users.findById(req.headers.userid);
		res.status(200).json({ok:true, msg:currentUser.PrivateData.ProfilePhotoPath});
	}catch(err){
		try{
			const errorMessage = JSON.parse(err.message);
			res.status(errorMessage.status || 400).json(errorMessage);
		}catch{
			res.status(500).json({ok:false, state:500, msg:"internalServerError"});
		}
	}
};

module.exports = getUserPhotoById;