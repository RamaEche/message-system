let WSclients = []; 

const validateUserBySocket = (socket)=>{
	const currentClientIndex = WSclients.findIndex(client => client.socket == socket);
	if(currentClientIndex != -1){
		return WSclients[currentClientIndex];
	}else{
		return false;
	}
};

module.exports = {validateUserBySocket, WSclients};