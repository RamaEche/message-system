require("dotenv").config();

const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("./config/db.js");
let express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const {validateTokenMW} = require("./middlewares/validateToken.js");
const cors = require("cors");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		const fileExtencion = file.mimetype.substring(file.mimetype.indexOf("/")+1, file.mimetype.length);
		cb(null, file.fieldname + "-" + Date.now()+ "." + fileExtencion);
	}
});
const upload = multer({storage:storage, limits:{ files:1 }});

cloudinary.config({
	cloud_name: process.env.CD_NAME,
	api_key: process.env.CD_API_KEY,
	api_secret: process.env.CD_API_SECRET
});

let app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_URL.slice(0, -1),
		methods: ["GET", "POST"]
	}
});
app.use(cors());
app.use(bodyParser.json());

const postLogIn = require("./routes/postLogIn.js");
const postSingIn = require("./routes/postSingIn.js");
const postRestorePassword = require("./routes/postRestorePassword.js");
const postRemoveUser = require("./routes/postRemoveUser.js");
const postUpdateProfile = require("./routes/postUpdateProfile.js");
const postUpdateGroup = require("./routes/postUpdateGroup.js");
const getChatPhotoById = require("./routes/getChatPhotoById.js");
const getUserPhotoById = require("./routes/getUserPhotoById.js");

app.post("/logIn", postLogIn);
app.post("/singIn", upload.single("ProfileImage"), postSingIn);
app.post("/restorePassword", validateTokenMW, postRestorePassword);
app.get("/getChatPhotoById", validateTokenMW, getChatPhotoById);
app.get("/getUserPhotoById", validateTokenMW, getUserPhotoById);
app.post("/UpdateProfile", upload.single("ProfileImage"), validateTokenMW, postUpdateProfile);
app.post("/UpdateGroup", upload.single("ChatImage"), validateTokenMW, postUpdateGroup);

app.post("/removeUser", validateTokenMW, postRemoveUser); //Review, it is likely that it needs verification.

// // Embedded client //--//
// // start
// const path = require("path");

// console.log(__dirname);
// app.use(express.static(path.join(__dirname, "/client/dist")));

// app.get("*", (req, res)=>{
// 	res.sendFile(path.join(__dirname, "/client/dist/index.html"));
// });

// //client end

server.listen(process.env.PORT, "0.0.0.0", () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});

module.exports = io;

require("./webSocket/ChatWebSocket.js");