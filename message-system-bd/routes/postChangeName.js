require('dotenv').config()

const bcrypt = require('bcryptjs');
const fs = require('fs/promises');
const path = require('path');
const Chats = require('../models/Chats.js');
const Users = require('../models/Users.js');
const createToken = require('../controllers/createToken.js');
const imageType = require('image-type');
const { rmSync } = require('fs');

const postChangeName = async(req, res)=>{  
  let newUserRes = {};
  try{
    const chat = await Chats.findById(req.headers['chatid'])

    chat.Users.forEach(async (user, index)=>{
      if(user.UserId != req.user.UserID){
        const userGeted = await Users.findById(user.UserId)

        if(req.body.name != user.Name && (req.body.name.length >= 4 && req.body.name.length <= 15) ){
          user.Name = req.body.name
          await Chats.findOneAndUpdate({ _id: req.headers['chatid'] },
          { $set: { [`Users.${index}`]: user } });
          res.status(200).json({ok:true, name:newUserRes.name});
        }else{
          throw new Error({ok:false, state:500, msg:"Internal Server Error"})
        }
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

module.exports = postChangeName;