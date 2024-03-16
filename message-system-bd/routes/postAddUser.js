const Users = require('../models/Users');
const createComunicationChanel = require('../controllers/createComunicationChanel')

const postAddUser = async(req, res)=>{
    let mainUser;
    try{
        mainUser= await Users.findById(req.user.UserID)
    }catch (err){
      res.status(403).json({ error: "Valid Token But invalid user." })
      console.error(err)
    }

    try{
        //compruebe que el usuario main no tenga una conversacion ya abierta con el otro usuario
        let chatInCommon = false
        const otherUser = await Users.findById(req.body.id)
        mainUser.Chats.Users.forEach(mainChatId => {
            otherUser.Chats.Users.forEach(otherChatId => {
                if(mainChatId == otherChatId){
                    chatInCommon = true;
                }
            });
        });
        if(chatInCommon) throw new Error('{ "ok":false, "status":400, "err":"chatInCommon"}')

        createComunicationChanel({type:"U", usersID:[req.body.id], nameOfOtherUser:req.body.name}, req.user.UserID)

        res.status(200).json({ok:true});
    }catch(err){
        try{
            err=JSON.parse(err.message)
            res.status(err.status || 400).json(err)
        }catch{
            console.error(err)
            res.status(500).json({ok:false, state:500, msg:"Internal Server Error"})
        }
    }
}

module.exports = postAddUser;