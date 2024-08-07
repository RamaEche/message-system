const mongoose = require("mongoose");

const CommunicationChannelSchema = new mongoose.Schema({
	Name: { type: String },
	PhotoPath: { type: String },
	Description: { type: String },
	Type: { type: String },
	Messages: [{
		MediaPath: { type: String },
		MediaType: { type: String },
		PublicationTime: { type: Date },
		TextMessage: { type: String },
		SeenById: [{ type: String }],
		SentById: { type: String }
	}],
	Users: [{
		UserId: { type: String },
		Name: { type: String },
		Roll: { type: String }
	}],
	MediaFolderPath: { type: String }
}, {collection:"Chats"});

const CommunicationChannel = mongoose.model("CommunicationChannel", CommunicationChannelSchema);

module.exports = CommunicationChannel;