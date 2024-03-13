const Users = require('../models/Users.js')
const Chats = require('../models/Chats.js')

const postLeaveGroup = async(req, res)=>{  
  try{
    await Users.findById(req.user.UserID)
  }catch (err){
    res.status(403).json({ error: "Valid Token But invalid user." })
    console.error(err)
  }

  try{
    //eliminar a usuario req.user.UserID de chat
    const currentChat = await Chats.findById(req.body.chatId).exec()
    if(currentChat.Users.length == 0) throw new Error('{ "ok":false, "status":400, "err":"lastUser"}')

    let newUsers = [];
    let anyAdmin = false;
    currentChat.Users.forEach(({UserId, Roll}, index)=>{
      if(UserId != req.user.UserID){
        newUsers.push({ UserId, Roll })
        if(Roll == "A"){
          anyAdmin = true;
        }
      }
    })
    if(!anyAdmin){
      newUsers[0].Roll = "A";
    }
    await Chats.updateOne({_id:req.body.chatId}, {$set:{'Users':newUsers}})

    //eliminar chat id de usuario
    const currentUsers = await Users.findById(req.user.UserID).exec()
    let newChatsGroups = [];
    currentUsers.Chats.Groups.forEach((value, index)=>{
      if(value != req.body.chatId){
        newChatsGroups.push(value)
      }
    })
    await Users.updateOne({_id:req.user.UserID}, {$set:{'Chats.Groups':newChatsGroups}})

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
  
module.exports = postLeaveGroup;