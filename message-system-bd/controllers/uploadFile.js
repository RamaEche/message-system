const cloudinary = require("cloudinary").v2;

async function uploadFile(filePath, folder) {
	try {
		const result = await cloudinary.uploader.upload(filePath, {
			folder: folder
		});
		return result.secure_url;
	} catch (error) {
		console.error("Error uploading file:", error);
	}
}

module.exports = uploadFile;