const validateInWSSystem = require("./controllers/validateInWSSystem.js")
const { WSclients } = require("./controllers/validateUserBySocket.js")
const Chats = require("../models/Chats.js")

const postNewMessage = async (socket, data) => {
    let validatedData = await validateInWSSystem(socket, "postNewMessage", data)
    if (validatedData == 0) return 0
    let [user, userId] = validatedData;

    try{
        //Corroborar que el chat exista
        const chat = await Chats.findById(data.chatId)

        //corroborar que el usuario tenga los permisos para postear un mensaje en el chat
        for (let i = 0; i < chat.Users.length; i++) {
            if(chat.Users[i].UserId == userId){
                if(chat.Users[i].Roll != 'N' && chat.Users[i].Roll != 'A'){
                    throw new Error("Unprivileged user.")
                }
            } 
        }
        
        //Guardar mensaje en la base de datos del chat
        const postedTime = new Date()
        let updatedChat;
        try{
            updatedChat = await Chats.findOneAndUpdate(
                { _id: data.chatId },
                {
                    $push: {
                        "Messages": {
                            MediaPath: "", // falta
                            MediaType: "", // falta
                            PublicationTime: postedTime,
                            TextMessage: data.text,
                            SeenById: [userId], // falta
                            SentById: userId // falta
                        }
                    }
                },
                { new: true }
            );
        }catch (err){
            socket.emit("postNewMessage", { status:403, error: "Invalid chat." })
            return 0
            console.error(err)
        }

        //Enviar notificacion de recivido por el servidor al server sent event
        socket.emit("postNewMessage", { status:201, error: "Created resource." })

        for (let i = 0; i < chat.Users.length; i++) {
            for (let j = 0; j < WSclients.length; j++) {
                if(WSclients[j].userId == chat.Users[i].UserId && WSclients[j].userId != userId){
                    WSclients[j].socket.emit("fromServerNewMessage", {
                        chatId:data.chatId,

                        id:updatedChat.Messages[updatedChat.Messages.length-1].id,
                        MediaPath:"",
                        MediaType:"",
                        PublicationTime:postedTime,
                        TextMessage:data.text,
                        SeenById:[userId],
                        SentById:userId,
                        internalOrigin:false
                    })
                }
            }

        }
    }catch (err){
        socket.emit({ status:403, error: "Invalid chat." })
        console.error(err)
    }
}

module.exports = postNewMessage;