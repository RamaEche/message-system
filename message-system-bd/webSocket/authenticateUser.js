const { validateToken } = require('../middlewares/validateToken.js')
const Users = require("../models/Users.js")
const Chats = require("../models/Chats.js")
const updateUserCurrentState = require('./controllers/updateUserCurrentState.js')
const { validateUserBySocket } = require('./controllers/validateUserBySocket.js')

const authenticateUser = async (socket, data, WSclients)=>{
    let userId;
    try{
        validateToken(data);
        userId = data.user.UserID;
    }catch(err){
        socket.emit('authenticateUser', { status:401, error: "Unauthorized." })
        console.error({ status:401, error: "Unauthorized." })
        return new Error("Error")
    }

    let user;
    try{
        user = await Users.findById(userId)
    }catch (err){
        socket.emit(emitTo, { status:403, error: "Valid Token But invalid user." })
        console.error(err)
        return 0
    }
    
    try{
        socket.emit('authenticateUser', { status:200, userId:userId })
        
    }catch (err){
        socket.emit('authenticateUser', { status:403, error: "Valid Token But invalid user." })
        console.error(err)
        return 0
    }

    try{
        let linkedUsers = []
        user.Chats.Users.forEach(async userChatId=>{

            const currentChat = await Chats.findById(userChatId)
            const otherChatUserId = currentChat.Users.filter(chatUser => chatUser.UserId != userId)[0].UserId
            
            linkedUsers.push({ userId:otherChatUserId, commonChatId:userChatId })
               
            const validateRes = validateUserBySocket(otherChatUserId)
            if(validateRes){
                validateRes.socket.emit('updateUserChatCurrentStatus', { state:true, chatId:userChatId })
            }
        })

        WSclients.push({socket, userId, linkedUsers})

    }catch(err){
        socket.emit('authenticateUser', { status:403, error: "Valid Token But invalid user." })
        console.error(err)
        return 0
    }
}

module.exports = authenticateUser;