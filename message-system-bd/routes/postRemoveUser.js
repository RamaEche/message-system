require('dotenv').config()

const Users = require('../models/Users.js');
const fs = require('fs/promises');

const postRemoveUser = async(req, res)=>{
  console.log("cuenta borrada")
  res.status(500).json({ok:true})
  return 0

  let user;
  try{
    user = await Users.findById(req.user.UserID)
  }catch (err){
    res.status(403).json({ error:"ValidTokenInvalidUser" })
    console.error(err)
  }

  let Imgbuffer;
  try{
    if(user.PrivateData.ProfilePhotoPath){
      try{
        ProfilePhotoPathParts = user.PrivateData.ProfilePhotoPath.split("\\")[user.PrivateData.ProfilePhotoPath.length -1]
        ProfilePhotoPathParts.pop(ProfilePhotoPathParts[ProfilePhotoPathParts.length - 1])
        await fs.rmSync(ProfilePhotoPathParts, { recursive: true, force: true });
      }catch(err){
        throw new Error('{ "ok":false, "status":500, "err":"impossibleRemoveAccount"}')
      }
    }

    //recorrer chats de grupos y usuarios
    //usar metodo de controller para eliminar chats usuario
    //usar metodo de controller para salir chats de grupo

    await Users.findByIdAndDelete(req.user.UserID)
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

module.exports = postRemoveUser;