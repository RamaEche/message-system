const cloudinary = require("cloudinary").v2;

async function deleteFile(url, pathFolder = "mediaFiles/mediaFiles/users/") {
	try{
		const parts = url.split("/");
		const imgName = parts[parts.length - 1].split(".")[0];
		const publicId = pathFolder + parts[parts.length - 2] + "/" +imgName;
		console.log(publicId);
		cloudinary.uploader.destroy(publicId, function(error, result) {
			if (error) {
				console.error("Error al eliminar el archivo:", error);
			} else {
				console.log("Archivo eliminado:", result);
			}
		});
	}catch{
		console.error("Corregir error!!!");
	}
}

module.exports = deleteFile;
