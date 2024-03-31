const mongoose = require("mongoose");

const TimeToRemoveMediaSchema = new mongoose.Schema({
	MediaPath: {type: String},
	FolderPath: {type: String},
	DaysToDelete: {type: String},
	MessaggeId: {type: String}
}, {collection:"TimeToRemoveMedia"});

const TimeToRemoveMedia = mongoose.model("TimeToRemoveMedia", TimeToRemoveMediaSchema);

module.exports = TimeToRemoveMedia;