const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  PrivateData: {
    Password: { type: String },
    UserName: { type: String },
    Description: { type: String },
    ProfilePhotoPath: { type: String },
    ProfileState: { type: String },
    CurrentState: { type: String }
  },
  Chats: {
    Users: [{ type: String }],
    Groups: [{ type: String }]
  }
}, {collection:"Users"});

const Users = mongoose.model('Users', UsersSchema);

module.exports = Users;