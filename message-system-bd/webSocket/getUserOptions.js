const getUserOptions = async (socket, data, user) => {
	try{
		const id = user._id;
		const userName = user.PrivateData.UserName;
		const description = user.PrivateData.Description;
		const info = {id, userName, description};
		socket.emit("getUserOptions", {status:200, info});
	} catch (err) {
		socket.emit("getUserOptions", { status:500, error: "internalServerError" });
		console.error(err);
		return 0;
	}
};

module.exports = getUserOptions;