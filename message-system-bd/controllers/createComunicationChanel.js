require('dotenv').config();

const Users = require('../models/Users.js');
const Chats = require('../models/Chats.js');
const fs = require('fs/promises');
const path = require('path');

const createComunicationChanel = async({type, name, description, usersID, chatGroupImagePath, nameOfOtherUser}, mainUserID)=>{  
    let chatUsers = [];
    let CCData;
    if(type == "G"){
      usersID.forEach(userId => {
        chatUsers.push({
          UserId:userId,
          Roll:"N"
        })
      });

      chatUsers.push({
        UserId:mainUserID,
        Roll:"A"
      })
      CCData = {
        Name:name,
        PhotoPath: "link",
        Description:description,
        Type: type,
        Messages: [],
        Users:chatUsers,
        MediaFolderPath: "MediaFolderPath..."
      }
    }else{
      usersID.forEach(userId => {
        chatUsers.push({
          UserId:userId,
          Name:nameOfOtherUser,
          Roll:"N"
        })
      });

      const mainUser = await Users.findById(mainUserID)
      chatUsers.push({
        UserId:mainUserID,
        Name:mainUser.PrivateData.UserName,
        Roll:"N"
      })
      
      CCData = {
        Type:type,
        Messages:[],
        Users:chatUsers,
        MediaFolderPath: "MediaFolderPath..."
      }
    }
  
    const newCC = await Chats.create(CCData)
  
    const mediaFilesChatsMedia = path.join(process.env.MEDIA_FILES, 'chats', `chat-ID${newCC.id}`, 'media')
    const mediaFilesChats = path.join(process.env.MEDIA_FILES, 'chats', `chat-ID${newCC.id}`)
    await fs.mkdir(mediaFilesChatsMedia, { recursive: true })
  
    if(newCC.Type == "G"){
      await Chats.updateOne({_id:newCC.id}, {$set:{"PhotoPath":path.join(process.env.MEDIA_FILES, 'chats', `chat-ID${newCC.id}`, chatGroupImagePath), "MediaFolderPath":mediaFilesChats}})
    }
    else {
      await Chats.updateOne({_id:newCC.id}, {$set:{"MediaFolderPath":mediaFilesChats}})
    }
    
  
    //Agregar a media time to remove en db
  
    newCC.Users.forEach(async u=>{
      const user = await Users.findById(u.UserId)
      if(newCC.Type == "G"){
        user.Chats.Groups.push(newCC.id)
        const res = await Users.updateOne({_id:u.UserId}, {$set:{"Chats.Groups":user.Chats.Groups}})
      }
      else {
        user.Chats.Users.push(newCC.id)
        const res = await Users.updateOne({_id:u.UserId}, {$set:{"Chats.Users":user.Chats.Users}})
      }
    })
  }

  module.exports = createComunicationChanel;