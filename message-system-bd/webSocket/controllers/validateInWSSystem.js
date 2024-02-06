const { validateToken } = require('../../middlewares/validateToken.js')
const { validateUserBySocket } = require('./validateUserBySocket.js')
const Users = require("../../models/Users.js")

const validateInWSSystem = async (socket, emitTo, data)=>{
    let userId
    try{
        validateToken(data);
        userId = data.user.UserID;
        if(!validateUserBySocket(userId)){
            socket.emit(emitTo, { status:401, error: "Unauthorized." })
            console.error({ status:401, error: "Unauthorized." })
            return 0
        }
    }catch(err){
        socket.emit(emitTo, { status:401, error: "Unauthorized." })
        console.error({ status:401, error: "Unauthorized." })
        return 0
    }


    let user;
    try{
        user = await Users.findById(userId)
    }catch (err){
        socket.emit(emitTo, { status:403, error: "Valid Token But invalid user." })
        console.error(err)
        return 0
    }

    return [user, userId]
}

module.exports = validateInWSSystem;