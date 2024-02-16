const validateInWSSystem = require('./controllers/validateInWSSystem')
const Users = require('../models/Users')
const Chats = require('../models/Chats')

const getMessagesChunk = async (socket, data)=>{
    let validatedData = await validateInWSSystem(socket, "getMessagesChunk", data)
    if (validatedData == 0) return 0
    let [user, userId] = validatedData;

    try{
        const chat = await Chats.findById(data.chatId).exec()
        let newMessages = [];

        let start = (chat.Messages.length-20)-(data.chunk*20);
        let end = (chat.Messages.length+1)-(data.chunk*20);
        if(start < 0) start = 0
        let toEmit = {
            messages: chat.Messages.slice(start, end),
            chunk:data.chunk
        }
        toEmit.messages.forEach(msj => {
            newMessages.push({
                id:msj.id,
                MediaPath: msj.MediaPath,
                MediaType: msj.MediaType,
                PublicationTime: msj.PublicationTime,
                TextMessage: msj.TextMessage,
                SeenById: msj.SeenById,
                SentById: msj.SentById,
                internalOrigin:msj.SentById == userId
            })
        });
        toEmit.messages = newMessages;

        if(data.chunk == 0){
            let users = []
            for (let i = 0; i < chat.Users.length; i++) {
                let userDB = await Users.findById(chat.Users[i].UserId).exec()
                chat.Users[i].name = userDB.PrivateData.UserName 
                users.push({
                    userId:chat.Users[i].UserId,
                    roll:chat.Users[i].Roll,
                    name:userDB.PrivateData.UserName
                })
            }
            if(chat.Type == "G"){
                toEmit.chatData = {
                    users:users,
                    type:chat.Type,
                    description:chat.Description,
                    name:chat.Name
                }
            }else{
                toEmit.chatData = {
                    users:users,
                    type:chat.Type,
                }
            }

        } 
        await socket.emit('getMessagesChunk', toEmit)      
    }catch(err){
        console.log(err)
    }
}

module.exports = getMessagesChunk;