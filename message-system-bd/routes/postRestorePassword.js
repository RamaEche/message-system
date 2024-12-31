//const ValidateUserRegistredByUserName = require("../controllers/ValidateUserRegistredByUserName.js");
const Users = require("../models/Users.js");
const createToken = require("../controllers/createToken.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ValidateUserRegistredByUserName = require("../controllers/ValidateUserRegistredByUserName.js");

const restorePassword = async(req, res)=>{
	try {
		if(!(req.body && req.body.UserName && req.body.LastPassword && req.body.NewPassword &&
      req.body.UserName.length >= 4 && req.body.UserName.length <= 15 &&
      req.body.LastPassword.length >= 5 && req.body.LastPassword.length <= 20 &&
      req.body.NewPassword.length >= 5 && req.body.NewPassword.length <= 20 )){
			throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"invalidInputs\"}");
		}

		if(!(req.body.NewPassword !== req.body.LastPassword)){ throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"samePassword\"}");}

		const validRes = await ValidateUserRegistredByUserName(req.body.UserName, req.body.LastPassword);
		if(!validRes.state){ throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"LastPasswordOrUsernameIncorrect\"}");}

		const token = req.headers.authorization.split(" ")[1];
		await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
			let isModified;
			const salt = await bcrypt.genSalt(10);
			const passwordHashed = await bcrypt.hash(req.body.NewPassword, salt);
	
			try{
				await Users.updateOne({ _id: decoded.UserID }, { $set: { "PrivateData.Password": passwordHashed } }); //id
				isModified = true;
			}catch{
				isModified = false;
			}
	
			if(isModified){
				const token = createToken({UserID:decoded.UserID}); //id
				res.status(200).json({ok:true, token:token});
			}else{throw new Error("{ \"ok\":false, \"status\":500, \"err\":\"wasNotModified\"}");}
		});
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