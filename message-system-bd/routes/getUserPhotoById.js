require("dotenv").config();

const { readdir } = require("fs/promises");
const path = require("path");

const getUserPhotoById = async(req, res)=>{
	try{
		let dir;
		let fileName;
		let files;

		dir = path.join(process.env.MEDIA_FILES, "users", `user-ID${req.headers.userid}`);
		files = await readdir(dir);

		files.map((element, i) => {
			if(element.startsWith("ProfileImage-"))fileName = files[i];
		});

		if(!fileName) throw new Error("{ \"ok\":false, \"status\":400, \"err\":\"noChatImage\"}");

		let options = {
			root: dir,
			dotfiles: "deny",
			headers: {
				"x-timestamp": Date.now(),
				"x-sent": true
			}
		};

		res.sendFile(fileName, options, function (err) {
			if (err) {
				throw new Error();
			}
		});
	}catch(err){
		try{
			const errorMessage = JSON.parse(err.message);
			res.status(errorMessage.status || 400).json(errorMessage);
		}catch{
			res.status(500).json({ok:false, state:500, msg:"internalServerError"});
		}
	}
};

module.exports = getUserPhotoById;