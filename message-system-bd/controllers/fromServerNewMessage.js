function fromServerNewMessage(socket){
	//Get unseen messages.
	//Get last message.
	//Update customer chat notifications.
	socket.emit("fromServerNewMessage", { notificationsCounter:55, lastTextMessage: "Last message." });
}

module.exports = fromServerNewMessage;