//const ValidateUserRegistredByUserName = require("../controllers/ValidateUserRegistredByUserName.js");
//const Users = require("../models/Users.js");
//const createToken = require("../controllers/createToken.js");
//const bcrypt = require("bcryptjs");

const restorePassword = async(req, res)=>{
	try {
		if(!(req.body && req.body.UserName && req.body.LastPassword && req.body.NewPassword &&
      req.body.UserName.length >= 4 && req.body.UserName.length <= 15 &&
      req.body.LastPassword.length >= 5 && req.body.LastPassword.length <= 20 &&
      req.body.NewPassword.length >= 5 && req.body.NewPassword.length <= 20 )){
			throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
		}

		if(!(req.body.NewPassword !== req.body.LastPassword)){ throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"samePassword\"}");}

		/*const validateUser = await ValidateUserRegistredByUserName(req.body.UserName, req.body.LastPassword);
		//BROKEN SYSTEM
 		if(validateUser.state){

			let isModified;

			const salt = await bcrypt.genSalt(10);
			const passwordHashed = await bcrypt.hash(newPassword, salt);

			try{
				await Users.updateOne({ _id: id }, { $set: { "PrivateData.Password": passwordHashed } });
				isModified = true;
			}catch{
				isModified = false;
			}

			if(isModified){
				const token = createToken({UserID:validateUser.UserID});
				res.status(200).json({ok:true, token:token});
			}else{throw new Error("{ \"ok\":false, \"status\":500, \"err\":\"wasNotModified\"}");}
		}else{throw new Error("{ \"ok\":false, \"status\":401, \"err\":\"invalidCredentials\"}");}  */

	}catch(err){
		try{
			const errorMessage = JSON.parse(err.message);
			res.status(errorMessage.status || 400).json(errorMessage);
		}catch{
			res.status(500).json({ok:false, state:500, msg:"internalServerError"});
		}
	}
};

module.exports = restorePassword;