const validateInWSSystem = require('./controllers/validateInWSSystem')
const Chats = require("../models/Chats.js")

const postChatRead = async (socket, data)=>{
    let validatedData = await validateInWSSystem(socket, "postChatRead", data)
    if (validatedData == 0) return 0
    let [user, userId] = validatedData;

    const chat = await Chats.findById(data.chatId)
    for (let i = chat.Messages.length; i > 0; i--) {
        const a = chat.Messages[i-1].SeenById.filter(id=>id == userId)[0]
        if(a == undefined){
            chat.Messages[i-1].SeenById.push(userId)
        }else{
            break
        }
    }
    let res = await Chats.replaceOne({_id:data.chatId}, chat)
}

module.exports = postChatRead;