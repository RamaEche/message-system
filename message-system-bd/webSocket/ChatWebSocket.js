const io = require('../index.js');
const postNewMessage = require('./postNewMessage.js')
const deleteMessage = require('./deleteMessage.js')
const getUserChats = require('./getUserChats.js')
const getMessagesChunk = require('./getMessagesChunk.js')
const postChatRead = require('./postChatRead.js')
const authenticateUser = require('./authenticateUser.js')
const { WSclients } = require('./controllers/validateUserBySocket.js')
const updateUserCurrentState = require('./controllers/updateUserCurrentState.js')

io.on('connection', socket=>{
    socket.on('authenticateUser', data=>authenticateUser(socket, data, WSclients))
    socket.on('postNewMessage', data=>{postNewMessage(socket, data)});
    socket.on('deleteMessage', data=>{deleteMessage(socket, data)});
    socket.on('getUserChats', data=>{getUserChats(socket, data)});
    socket.on('getMessagesChunk', data=>{getMessagesChunk(socket, data)});
    socket.on('postChatRead', data=>{postChatRead(socket, data)});
    socket.on('postUserOnline', data=>{postChatRead(socket, data)});
    socket.on("disconnect", async () => {
        const currentClientIndex = WSclients.findIndex(client=>client.socket == socket);
        if (currentClientIndex !== -1) {
            WSclients[currentClientIndex].linkedUsers.forEach(linkedUser => {
                const otherWSclient = WSclients.filter(WSclient => WSclient.userId == linkedUser.userId)[0]
                if(otherWSclient){
                    otherWSclient.socket.emit('updateUserChatCurrentStatus', { state:false, chatId:linkedUser.commonChatId })
                }
            });

            updateUserCurrentState(WSclients[currentClientIndex])
            WSclients.splice(currentClientIndex, 1);
        }
    });
});