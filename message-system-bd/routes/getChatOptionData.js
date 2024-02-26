require('dotenv').config()

const bcrypt = require('bcryptjs');
const fs = require('fs/promises');
const path = require('path');
const Users = require('../models/Users.js');
const Chats = require('../models/Chats.js');
const createToken = require('../controllers/createToken.js');
const imageType = require('image-type');
const { rmSync } = require('fs');

const getChatOptionData = async(req, res)=>{  
  let newUserRes = {};
  try{
    const chat = await Chats.findById(req.headers['chatid'])

    chat.Users.forEach(async user=>{
      if(user.UserId != req.user.UserID){
        newUserRes.name = user.Name
        const userGeted = await Users.findById(user.UserId)
        newUserRes.userName = '@'+userGeted.PrivateData.UserName
        newUserRes.description = userGeted.PrivateData.Description

        res.status(200).json({ok:true, userName:newUserRes.userName, name:newUserRes.name, description:newUserRes.description});
      }
    })
  }catch (err){
    console.error(err)
    try{
      err=JSON.parse(err.message)
      res.status(err.status || 400).json(err)
    }catch{
      res.status(500).json({ok:false, state:500, msg:"Internal Server Error"})
    }
  }
}

module.exports = getChatOptionData;