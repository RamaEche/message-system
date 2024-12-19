import './AboutMessageUser.css'
import {useState, useContext, useEffect} from 'react'
import {CurrentChatContext} from "../pages/Home"

function AboutMessageUser({id, focusedChat, chatsImage}) {
  const [currentChat] = useContext(CurrentChatContext)
  const [photoSrc, setPhotoSrc] = useState(`${import.meta.env.VITE_FRONTEND_APP_URL}user.png`)
  //const [messageStateText, setMessageStateText] = useState()
  //const [fileStateText, setFileStateText] = useState()
  const [name, setName] = useState("")
  
  const setImage = ()=>{
    let posibleImgIndx = chatsImage.findIndex(i=>i.chatID == id)
    setPhotoSrc(chatsImage[posibleImgIndx].src)
  }

  useEffect(()=>{
    let currentUser = currentChat.chatData.users.filter(user => user.userId == id)[0]
    setName(currentUser.name)

    setImage()
  }, [id])

  useEffect(()=>{
    //This is commented because the file system is not working.
    /*
    let fullMessageState = focusedChat.messageState
    let fullFileState = focusedChat.fileState

     if(fullMessageState == "mixed"){ //If focusedChat.messageState is mixed.
        fullMessageState = "onServer";
        if(fullFileState != "none"){
            fullFileState = "onServer"
        }
    
        for (let i = 0; i < focusedChat.seenBy.length; i++) {
            if(focusedChat.seenBy[i] == id){
                fullMessageState = "seen"
                if(fullFileState != "none"){
                    fullFileState = "seen"
                }
            }
        }
    }

    switch (fullFileState) {
        case "none":
            setFileStateText("")
            break;
        case "sending":
            setFileStateText("Sending image...")
            break;
        case "onServer":
            setFileStateText("Image not seen.")
            break;
        case "seen":
            setFileStateText("Image seen.")
            break;
        default:
            setFileStateText("error")
            break;
    }
      switch (fullMessageState) {
        case "sending":
          setMessageStateText("Sending message...")
          break;
        case "onServer":
          setMessageStateText("Message not seen.")
          break;
        case "seen":
          setMessageStateText("Message seen.")
          break;
        default:
          setMessageStateText("error")
          break;
      }
      */
  }, []);

  return (
    <>
    <a className='about-message-user-box'>
        <div className='about-message-user-content'>
            <div className='about-message-user-data'>
                <img className="about-message-user-image" src={photoSrc}/>
                <div className='about-message-user-text'>
                    <p className="about-message-user-name">{name}</p>
                </div>
            </div>
        </div>
        <div className='about-message-user-states'>
            <p className="about-message-user-state-message">{
              focusedChat.messageState == "sending" ? "Sending message..." :
              focusedChat.messageState == "onServer" ? "Message not seen." :
              focusedChat.messageState == "seen" ? "Message seen." : "error"}</p>
{/*             {fileStateText != "" &&
                <p className="about-message-user-state-file">{fileStateText}</p>
            } */}
        </div>
    </a>  
    </>
  )
}

export default AboutMessageUser