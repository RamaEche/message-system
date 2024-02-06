const validateInWSSystem = require("./controllers/validateInWSSystem.js")
const { WSclients } = require("./controllers/validateUserBySocket.js")
const Chats = require("../models/Chats.js")

const deleteMessage = async (socket, data) => {
    let validatedData = await validateInWSSystem(socket, "postNewMessage", data)
    if (validatedData == 0) return 0
    let [user, userId] = validatedData;

    let chat;
    try{
        //Corroborar que el chat exista
        chat = await Chats.findById(data.chatId)

    }catch (err){
        socket.emit("deleteMessage", { status:403, error: "Invalid chat." })
        console.error(err)
        return 0
    }

    try{
        //corroborar que el usuario tenga los permisos para borrar un mensaje en el chat
        for (let i = 0; i < chat.Users.length; i++) {
            if(chat.Users[i].UserId == userId){
                if(chat.Users[i].Roll != 'N' && chat.Users[i].Roll != 'A'){
                    throw new Error("Unprivileged user.")
                }else{
                    //comprueba que el mensaje a borrar lo haya posteado ese usuario
                    if(userId != chat.Messages.filter(msg => msg.id == data.messageId)[0].SentById){
                        throw new Error("Unprivileged user.")
                    }
                }
            } 
        }
    }catch (err){
        socket.emit("deleteMessage", { status:403, error: "Unprivileged user." })
        console.error(err)
        return 0
    }

    try {
        let result = await Chats.updateOne(
            { "Messages._id": data.messageId },
            { $pull: { Messages: { _id: data.messageId } } }
        );

        if (result.nModified < 1) {
            throw new Error("Invalid message id.")
        }
    } catch (err) {
        socket.emit("deleteMessage", { status:400, error: "Invalid message id." })
        console.error(err)
        return 0
    }

    socket.emit("deleteMessage", {status:200})
}

module.exports = deleteMessage;