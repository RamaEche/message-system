const Users = require("../models/Users.js");
const bcrypt = require("bcryptjs");

const ValidateUserRegistredByUserName = async(UserName, Password)=>{
	const user = await Users.find({"PrivateData.UserName":UserName});
	if(user.length != 0){
		const isPassword = await bcrypt.compare(Password, user[0].PrivateData.Password);
		if(isPassword && user[0].PrivateData.UserName == UserName){
			return {state:true, UserID:user[0].id};
		}
	}
	return {state:false, UserID:null};
};

module.exports = ValidateUserRegistredByUserName;