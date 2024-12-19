const cloudinary = require("cloudinary").v2;

const deleteFile = async (url, pathFolder = "mediaFiles/mediaFiles/users/")=>{
	try{
		const parts = url.split("/");
		const imgName = parts[parts.length - 1].split(".")[0];
		const publicId = pathFolder + parts[parts.length - 2] + "/" +imgName;
		await cloudinary.uploader.destroy(publicId);
	}catch{
		//console.error("Error deleting file");
	}
};

module.exports = deleteFile;
