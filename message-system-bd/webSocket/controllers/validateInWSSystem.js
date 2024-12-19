const { validateToken } = require("../../middlewares/validateToken.js");
const { validateUserBySocket } = require("./validateUserBySocket.js");
const authenticateUser = require("./authenticateUser.js");

const validateInWSSystem = async (socket, emitTo, data, WSclients)=>{
	try{
		const user = await validateToken(data);
		if(!user.id) return 0;
		if(user.id && !validateUserBySocket(user.id)){
			authenticateUser(socket, emitTo, data, WSclients, user);
		}
		return [user, user.id];
	}catch(err){
		socket.emit(emitTo, { status:401, error: "Unauthorized." });
		return 0;
	}
};

module.exports = validateInWSSystem;