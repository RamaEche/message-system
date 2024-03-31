const Chats = require("../models/Chats.js");

const postNewMessgae = async(req, res)=>{  
	try{
		//Corroborar que el chat exista
		const chat = await Chats.findById(req.body.chatId);

		//corroborar que el usuario tenga los permisos para postear un mensaje en el chat
		for (let i = 0; i < chat.Users.length; i++) {
			if(chat.Users[i].UserId == req.user.id){
				if(chat.Users[i].Roll != "N" && chat.Users[i].Roll != "A"){
					throw new Error("Unprivileged user.");
				}
			}
		}
	}catch (err){
		res.status(403).json({ error: "Invalid chat." });
		console.error(err);
	}

	//Guardar mensaje en la base de datos del chat

	/*     try{
      await Chats.updateOne({ _id: id }, { $set: { "Messages": [...chat, 
        {
          Id:"8h9823hed78hw78dhb2u3ih",//falta
          MediaPath:"",//falta
          MediaType:"",//falta
          PublcationTime:new Date(),
          TextMessage:req.body.text,
          SeenBy:["req.user.id"],//falta
          SentBy:req.user.id//falta
        }
      ]}})
    }catch (err){
      res.status(403).json({ error: "Invalid chat." })
      console.error(err)
    }
     */

	//Enviar notificacion de recivido por el servidor al server sent event
};
  
module.exports = postNewMessgae;