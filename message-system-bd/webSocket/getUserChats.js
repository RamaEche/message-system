const validateInWSSystem = require('./controllers/validateInWSSystem.js')
const { validateUserBySocket, WSclients } = require('./controllers/validateUserBySocket.js')
const Chats = require("../models/Chats.js")
const Users = require("../models/Users.js")

const postNewMessage = async (socket, data) => {
    let validatedData = await validateInWSSystem(socket, "postNewMessage", data)
    if (validatedData == 0) return 0
    let [user, userId] = validatedData;

    const ids = user.Chats.Groups.concat(user.Chats.Users); 
    let chats = [];
    for (let i = 0; i < ids.length; i++){
      let currentChat = await Chats.findById(ids[i]).exec()
      let chatDescription;
      let otherChatUserCurrentState;
      let name;
      let otherChat;
      let ignoredMsgs = 0;

      if(currentChat.Messages.length != 0){chatDescription = currentChat.Messages[currentChat.Messages.length-1].TextMessage}
      else{ chatDescription = ''}
      
      if(currentChat.Type == "G"){
        name = currentChat.Name;

        otherChatUserCurrentState = null;
      }else{
        let otherUserId;
        currentChat.Users.forEach(user => {
          if(user.UserId != userId){
            otherUserId = user.UserId;
            otherChat = Users.findById(user.UserId).exec();
          }
        });
        otherChat = await otherChat;
        name = otherChat.PrivateData.UserName;

        if(validateUserBySocket(otherUserId)){
          otherChatUserCurrentState = true;
        }else{
          otherChatUserCurrentState = false;
        }
      }

      for (let i = currentChat.Messages.length -1; i >= 0; i--) {
        
        if(currentChat.Messages[i].SentById == userId){
          break;
        }

        let seen = false;
        currentChat.Messages[i].SeenById.forEach(j=>{
          if(j ==  userId){
            seen = true;
          }
        })

        if(!seen){
          ignoredMsgs++;
        }
      }

      chats.push({
        id: currentChat.id,
        Name:name,
        Type:currentChat.Type,
        Description:chatDescription,
        UserCurrentState:otherChatUserCurrentState,
        IgnoredMessageCounter:ignoredMsgs,
      })
    }
    socket.emit('getUserChats', {status:200, chats})

}

module.exports = postNewMessage;