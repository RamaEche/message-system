const Users = require('../models/Users.js')
const Chats = require('../models/Chats.js')
const fs = require('fs/promises');
const path = require('path');

const postDeleteGroup = async(req, res)=>{  
  try{
    await Users.findById(req.user.UserID)
  }catch (err){
    res.status(403).json({ error: "Valid Token But invalid user." })
    console.error(err)
  }

  try{
    const currentChat = await Chats.findById(req.body.chatId).exec()
    let chatUsers = currentChat.Users
    
    for (let i = 0; i < chatUsers.length; i++) {
      const currentUsers = await Users.findById(chatUsers[i].UserId).exec()
      let newChatsGroups = [];
      currentUsers.Chats.Groups.forEach((value, index)=>{
        if(value != req.body.chatId){
          newChatsGroups.push(value)
        }
      })
      await Users.updateOne({_id:chatUsers[i].UserId}, {$set:{'Chats.Groups':newChatsGroups}})
    }

    await Chats.deleteOne({_id: req.body.chatId})

    //eliminar carpeta de chat
    const mediaFiles = path.join(process.env.MEDIA_FILES, 'chats', `chat-ID${req.body.chatId}`)
    await fs.rm(mediaFiles, { recursive: true })

    res.status(200).json({ok:true});
  }catch(err){
    console.error(err)
    try{
      err=JSON.parse(err.message)
      res.status(err.status || 400).json(err)
    }catch{
      res.status(500).json({ok:false, state:500, msg:"Internal Server Error"})
    }
  }
}
  
module.exports = postDeleteGroup;