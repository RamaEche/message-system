require('dotenv').config()

const bcrypt = require('bcryptjs');
const fs = require('fs/promises');
const path = require('path');
const Users = require('../models/Users.js');
const createToken = require('../controllers/createToken.js');
const imageType = require('image-type');
const { rmSync } = require('fs');

const singIn = async(req, res)=>{
  try{
    const Imgbuffer = await fs.readFile(path.join(process.env.UPLOADS_FILES, req.file.filename))
    const ImgType = imageType(Imgbuffer)
    if(!(ImgType && ImgType.mime === 'image/jpeg')){
      await rmSync(path.join(process.env.UPLOADS_FILES, req.file.filename))
      throw new Error('{ "ok":false, "status":400, "err":"invalidInputs"}')
    }

    let newUserRes;
    
    if(!(req.body && req.body.UserName && req.body.ValidatePasword && req.body.Password && req.body.Description &&
      req.body.UserName.length >= 4 && req.body.UserName.length <= 15 &&
      req.body.ValidatePasword.length >= 5 && req.body.ValidatePasword.length <= 20 &&
      req.body.Password.length >= 5 && req.body.Password.length <= 20 &&
      req.body.Description.length >= 1 && req.body.Description.length <= 100)){
      throw new Error('{ "ok":false, "status":400, "err":"invalidInputs"}')
    }

    if(!(req.body.Password === req.body.ValidatePasword)){ throw new Error('{ "ok":false, "status":400, "err":"diferentPassword"}')}
    
    const user = await Users.find({'PrivateData.UserName':req.body.UserName})
    if(user.length != 0){throw new Error('{ "ok":false, "status":400, "err":"alreadyRegistered"}')}
    
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(req.body.Password, salt);
    await Users.create({
      PrivateData:{
        Password: passwordHashed,
        UserName: req.body.UserName,
        Description: req.body.Description,
        ProfilePhotoPath: "",
        ProfileState: "Active",
        CurrentState: "ON"
      },
      Chats: {
        Users: [],
        Groups: []
      }
    })

    const newUser = await Users.find({'PrivateData.UserName':req.body.UserName})
    if(newUser && newUser.length != 0){
      const token = createToken({UserID:newUser[0].id})
      newUserRes = {
        serverRes:{ok:true, token:token},
        UserID:newUser[0].id
      }
    }
    
    const userID = newUserRes.UserID
    const mediaFiles = path.join(process.env.MEDIA_FILES, 'users', `user-ID${userID}`)
    await fs.mkdir(mediaFiles, { recursive: true })

    fs.rename(path.join(process.env.UPLOADS_FILES, req.file.filename), path.join(mediaFiles, req.file.filename))

    await Users.updateOne({_id:userID}, {$set:{'PrivateData.ProfilePhotoPath':path.join(mediaFiles, req.file.filename)}})

    res.status(201).json(newUserRes.serverRes);
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

module.exports = singIn;