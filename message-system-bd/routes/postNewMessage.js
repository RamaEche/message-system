const Chats = require("../models/Chats.js");

const postNewMessgae = async(req, res)=>{  
	try{
		//Verify that the chat exists.
		const chat = await Chats.findById(req.body.chatId);

		//verify that the user has the permissions to post a message in the chat.
		for (let i = 0; i < chat.Users.length; i++) {
			if(chat.Users[i].UserId == req.user.id){
				if(chat.Users[i].Roll != "N" && chat.Users[i].Roll != "A"){
					throw new Error("Unprivileged user.");
				}
			}
		}
	}catch (err){
		res.status(403).json({ error: "Invalid chat." });
		console.error("Attempted message to non-existent chat. Possible web attack: ", err);
	}

	//Save message to chat database.

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

	//Send notification received by the server to the server sent event.
};
  
module.exports = postNewMessgae;