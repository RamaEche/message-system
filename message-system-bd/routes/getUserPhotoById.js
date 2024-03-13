require('dotenv').config()

const Users = require('../models/Users');
const Chats = require('../models/Chats');
const { readdir } = require('fs/promises');
const path = require('path');

const getUserPhotoById = async(req, res)=>{
    try{
      await Users.findById(req.user.UserID)
    }catch (err){
      res.status(403).json({ error: "Valid Token But invalid user." })
      console.error(err)
    }

    let dir = path.join(process.env.MEDIA_FILES, 'users', `user-ID${req.headers.userid}`)
    let fileName;
    let files;

    try{
      files = await readdir(dir)
    }catch(err){
      console.error(err)
    }

    files.map((element, i) => {
      if(element.startsWith('ProfileImage-'))fileName = files[i]
    });

    if(!fileName) console.error("No chat image")

    let options = {
        root: dir,
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
    }

    try{
      res.sendFile(fileName, options, function (err) {
        if (err) {
          console.log(err)
        }
    })
    }catch (err){
      res.status(400).json({err})
    }
}

module.exports = getUserPhotoById;