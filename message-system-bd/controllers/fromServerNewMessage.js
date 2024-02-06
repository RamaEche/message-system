function fromServerNewMessage(socket, userId, chatId){
    //conseguir mensajes no vistos
    //conseguir ultimo mensaje
    //Actualizar las notificaciones de los chats de el cliente
    socket.emit("fromServerNewMessage", { notificationsCounter:55, lastTextMessage: "Last message" })
}

module.exports = fromServerNewMessage;