require('dotenv').config();

const bodyParser = require('body-parser');
const multer = require('multer');
require('./config/db.js');
let express = require('express');
const validateToken = require('./middlewares/validateToken.js');
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
app.use(cors());
app.use(bodyParser.json())

const userChats = require('./routes/getUserChats.js');
const logIn = require('./routes/postLogIn.js');
const singIn = require('./routes/postSingIn.js');
const restorePassword = require('./routes/postRestorePassword.js');
const getChatPhotoById = require('./routes/getChatPhotoById.js');
const createComunicationChanel = require('./controllers/createComunicationChanel.js');

app.get('/u', createUser = (req, res)=>{
  createComunicationChanel({type:"U", usersID:["65832ac087c19793379fd28b"]}, "65832b4f87c19793379fd291")//agregar data temporalmente
  res.status(200).json("Bien")
})

app.get('/g', creategroup = (req, res)=>{
  createComunicationChanel({name:"Grupitoooo", Description:"GroupDescription", type:"G", usersID:["65832b4f87c19793379fd291"], chatGroupImagePath:'ChatImage-1702755942018.jpeg'}, "65832ac087c19793379fd28b")//agregar data temporalmente
  res.status(200).json("Bien")
})

app.get('/UserChats', validateToken, userChats)
app.post('/LogIn', logIn);
app.post('/SingIn', upload.single('ProfileImage'), singIn);
app.post('/RestorePassword', restorePassword);
app.get('/getChatPhotoById', validateToken, getChatPhotoById);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})