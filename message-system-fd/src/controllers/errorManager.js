const errorManager = (info, setError)=>{
    console.error(info)
    switch (info.err) {
        case "ValidTokenInvalidUser":
          setError("Valid token but invalid user.")
          break;
        case "invalidInputs":
          setError("The format is invalid.")
          break;
        case "diferentPassword":
          setError("The password and validation password are different from each other.")
          break;
        case "alreadyRegistered":
          setError("This username is in use. try another.")
          break;
        case "impossibleImageUpdate":
          setError("Some problem on the server makes it impossible to update the image.")
          break;
        case "samePassword":
          setError("The last password and the new password are the same.")
          break;
        case "wasNotModified":
          setError("The server could not modify the password, try again later.")
          break;
        case "invalidCredentials":
          setError("The username, new password or last password are not correct.")
          break;
        case "impossibleRemoveAccount":
          setError("Impossible remove account.")
          break;
        case "LastPasswordOrUsernameIncorrect":
          setError("The last password or username is incorrect.")
          break;
        default:
          setError("Unknown error, try later.")
          console.error("Unknown error")
          break;
      }
      
}

export default errorManager