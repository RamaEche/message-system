require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL)
  .then(()=> console.log('Conected to mongodb.')) 
  .catch(err => console.log('Conection error: ', err))