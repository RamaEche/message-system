require('dotenv').config()

const Users = require('../models/Users.js');
const fs = require('fs/promises');
const { rmSync } = require('fs');
const path = require('path');
const imageType = require('image-type');

const updateProfile = async(req, res)=>{
  let user;
  try{
    user = await Users.findById(req.user.UserID)
  }catch (err){
    res.status(403).json({ error:"ValidTokenInvalidUser" })
    console.error(err)
  }

  let Imgbuffer;
  try{
    if(req.body){      
      if(req.body.UserName != user.PrivateData.UserName && req.body.UserName.length >= 4 && req.body.UserName.length <= 15){ //username cambio
        try{
          await Users.updateOne({_id:req.user.UserID}, {$set:{'PrivateData.UserName':req.body.UserName}})
        }catch(err){
          throw new Error('{ "ok":false, "status":400, "err":"alreadyRegistered"}')
        }
      }else if(req.body.UserName != 0){
        throw new Error('{ "ok":false, "status":400, "err":"invalidInputs"}')
      }
    }

    if(req.file){
      const changeImage = async()=>{ //imagen cambio
        const mediaFiles = path.join(process.env.MEDIA_FILES, 'users', `user-ID${req.user.UserID}`)  
        fs.rename(path.join(process.env.UPLOADS_FILES, req.file.filename), path.join(mediaFiles, req.file.filename))
    
        await Users.updateOne({_id:req.user.UserID}, {$set:{'PrivateData.ProfilePhotoPath':path.join(mediaFiles, req.file.filename)}})
      }

      Imgbuffer = await fs.readFile(path.join(process.env.UPLOADS_FILES, req.file.filename))
      const ImgType = imageType(Imgbuffer)
      if(!(ImgType && ImgType.mime === 'image/jpeg')){
        rmSync(path.join(process.env.UPLOADS_FILES, req.file.filename))
        throw new Error('{ "ok":false, "status":400, "err":"invalidInputs"}')
      }

      if(user.PrivateData.ProfilePhotoPath){
        try{
          lastImage = await fs.readFile(user.PrivateData.ProfilePhotoPath)
          if(lastImage != Imgbuffer){
            rmSync(user.PrivateData.ProfilePhotoPath)
            changeImage()
          }
        }catch(err){
          throw new Error('{ "ok":false, "status":500, "err":"impossibleImageUpdate"}')
        }
      }else{
        changeImage()
      }
    }

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

module.exports = updateProfile;