require('dotenv').config();

const bodyParser = require('body-parser');
const multer = require('multer');
require('./config/db.js');
let express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const {validateTokenMW} = require('./middlewares/validateToken.js')
const cors = require('cors');

const storage = multer.diskStorage({
              destination: function (req, file, cb) {
                cb(null, 'uploads/')
              },
              filename: function (req, file, cb) {
                fileExtencion = file.mimetype.substring(file.mimetype.indexOf('/')+1, file.mimetype.length)
                cb(null, file.fieldname + '-' + Date.now()+ '.' + fileExtencion)
              }
            })
const upload = multer({storage:storage, limits:{ files:1 }})

let app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
app.use(cors());
app.use(bodyParser.json())

const getUserChats = require('./routes/getUserChats.js');
const postSearchUnknownUsers = require('./routes/postSearchUnknownUsers.js');
const postLogIn = require('./routes/postLogIn.js');
const postAddUser = require('./routes/postAddUser.js');
const postSingIn = require('./routes/postSingIn.js');
const postRestorePassword = require('./routes/postRestorePassword.js');
const postRemoveUser = require('./routes/postRemoveUser.js');
const postUpdateProfile = require('./routes/postUpdateProfile.js');
const postUpdateGroup = require('./routes/postUpdateGroup.js');
const getChatPhotoById = require('./routes/getChatPhotoById.js');
const getUserPhotoById = require('./routes/getUserPhotoById.js');
const getGroupOptionData = require('./routes/getGroupOptionData.js');
const getChatOptionData = require('./routes/getChatOptionData.js');
const postChangeName = require('./routes/postChangeName.js');
const createComunicationChanel = require('./controllers/createComunicationChanel.js');
const postNewMessage = require('./routes/postNewMessage.js');
const postLeaveGroup = require('./routes/postLeaveGroup.js');
const postDeleteGroup = require('./routes/postDeleteGroup.js');

const { restart } = require('nodemon');

app.get('/u', createUser = (req, res)=>{
  createComunicationChanel({type:"U", usersID:["65832ac087c19793379fd28b"], nameOfOtherUser:"NewUserChat 1"}, "65832b4f87c19793379fd291")//agregar data temporalmente
  res.status(200).json("Bien")
})
app.get('/g', creategroup = (req, res)=>{
  createComunicationChanel({name:"Pepe grupo", description:"Grupo de prueba.", type:"G", usersID:["65832b4f87c19793379fd291"], chatGroupImagePath:'ChatImage-1702755942018.jpeg'}, "65832ac087c19793379fd28b")//agregar data temporalmente
  res.status(200).json("Bien")
})

app.get('/userChats', validateTokenMW, getUserChats)
app.post('/postSearchUnknownUsers', validateTokenMW, postSearchUnknownUsers)
app.post('/logIn', postLogIn);
app.post('/singIn', upload.single('ProfileImage'), postSingIn);
app.post('/restorePassword', validateTokenMW, postRestorePassword);
app.post('/removeUser', postRemoveUser);
app.post('/UpdateProfile', upload.single('ProfileImage'), validateTokenMW, postUpdateProfile);
app.post('/UpdateGroup', upload.single('ChatImage'), validateTokenMW, postUpdateGroup);
app.post('/postAddUser', validateTokenMW, postAddUser);
app.post('/postLeaveGroup', validateTokenMW, postLeaveGroup);
app.post('/postDeleteGroup', validateTokenMW, postDeleteGroup);
app.get('/getChatPhotoById', validateTokenMW, getChatPhotoById);
app.get('/getUserPhotoById', validateTokenMW, getUserPhotoById);
app.get('/getGroupOptionData', validateTokenMW, getGroupOptionData);
app.get('/getChatOptionData', validateTokenMW, getChatOptionData);
app.post('/postChangeName', validateTokenMW, postChangeName);
app.post('/postNewMessage', validateTokenMW, postNewMessage);

server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})

module.exports = io;

require('./webSocket/ChatWebSocket.js')