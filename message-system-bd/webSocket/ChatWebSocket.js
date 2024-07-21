const io = require("../index.js");
const postNewMessage = require("./postNewMessage.js");
const deleteMessage = require("./deleteMessage.js");
const getUserChats = require("./getUserChats.js");
const getUserOptions = require("./getUserOptions.js");
const getMessagesChunk = require("./getMessagesChunk.js");
const postChatRead = require("./postChatRead.js");
const { WSclients } = require("./controllers/validateUserBySocket.js");
const validateInWSSystem = require("./controllers/validateInWSSystem.js");

const postAddUser = require("./postAddUser.js");
const postCreateGroup = require("./postCreateGroup.js");
const postSearchUnknownUsers = require("./postSearchUnknownUsers.js");
const getGroupOptionData = require("./getGroupOptionData.js");
const postLeaveGroup = require("./postLeaveGroup.js");
const postDeleteGroup = require("./postDeleteGroup.js");
const getChatOptionData = require("./getChatOptionData.js");
const getChatDescriptionData = require("./getChatDescriptionData.js");
const postChangeName = require("./postChangeName.js");

const validateWS = async(next, socket, data, emitTo) =>{
	let validatedData = await validateInWSSystem(socket, emitTo, data, WSclients);
	if (validatedData == 0 ){
		socket.emit("authenticateUser", { status:401, error: "Valid Token But invalid user." });
		return 0;
	}
	let [user] = validatedData;

	next(socket, data, user);
};

io.on("connection", socket=>{
	socket.on("postNewMessage", data=>{validateWS(postNewMessage, socket, data, "postNewMessage");});
	socket.on("deleteMessage", data=>{validateWS(deleteMessage, socket, data, "deleteMessage");});
	socket.on("getUserChats", data=>{validateWS(getUserChats, socket, data, "getUserChats");});
	socket.on("getUserOptions", data=>{validateWS(getUserOptions, socket, data, "getUserOptions");});
	socket.on("getMessagesChunk", data=>{validateWS(getMessagesChunk, socket, data, "getMessagesChunk");});
	socket.on("postChatRead", data=>{validateWS(postChatRead, socket, data, "postChatRead");});
	socket.on("postAddUser", data=>{validateWS(postAddUser, socket, data, "postAddUser");});
	socket.on("postCreateGroup", data=>{validateWS(postCreateGroup, socket, data, "postCreateGroup");});
	socket.on("postSearchUnknownUsers", data=>{validateWS(postSearchUnknownUsers, socket, data, "postSearchUnknownUsers");});
	socket.on("getGroupOptionData", data=>{validateWS(getGroupOptionData, socket, data, "getGroupOptionData");});
	socket.on("postLeaveGroup", data=>{validateWS(postLeaveGroup, socket, data, "postLeaveGroup");});
	socket.on("postDeleteGroup", data=>{validateWS(postDeleteGroup, socket, data, "postDeleteGroup");});
	socket.on("getChatOptionData", data=>{validateWS(getChatOptionData, socket, data, "getChatOptionData");});
	socket.on("getChatDescriptionData", data=>{validateWS(getChatDescriptionData, socket, data, "getChatDescriptionData");});
	socket.on("postChangeName", data=>{validateWS(postChangeName, socket, data, "postChangeName");});
	
	socket.on("disconnect", async () => {
		const currentClientIndex = WSclients.findIndex(client=>client.socket == socket);
		if (currentClientIndex !== -1) {
			WSclients[currentClientIndex].linkedUsers.forEach(linkedUser => {
				const otherWSclient = WSclients.filter(WSclient => WSclient.userId == linkedUser.userId)[0];
				if(otherWSclient){
					otherWSclient.socket.emit("updateUserChatCurrentStatus", { state:false, chatId:linkedUser.commonChatId });
				}
			});
			WSclients.splice(currentClientIndex, 1);
		}
	});
});