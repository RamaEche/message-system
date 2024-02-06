let WSclients = []; 

const validateUserBySocket = (userId)=>{
    const currentClientIndex = WSclients.findIndex(client => client.userId == userId)
    if(currentClientIndex != -1){
        return WSclients[currentClientIndex]
    }else{
        return false
    }
}

module.exports = {validateUserBySocket, WSclients};