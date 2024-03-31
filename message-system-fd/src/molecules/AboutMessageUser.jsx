import './AboutMessageUser.css'
import {useState, useContext, useEffect} from 'react'
import {CurrentChatContext} from "../pages/Home"
import Cookies from 'js-cookie'

function AboutMessageUser({id, focusedChat}) {
  const [currentChat] = useContext(CurrentChatContext)
  const [photoSrc, setPhotoSrc] = useState('https://us.123rf.com/450wm/tuktukdesign/tuktukdesign1606/tuktukdesign160600119/59070200-icono-de-usuario-hombre-perfil-hombre-de-negocios-avatar-icono-persona-en-la-ilustraci%C3%B3n.jpg')
  const [messageStateText, setMessageStateText] = useState()
  const [fileStateText, setFileStateText] = useState()
  const [name, setName] = useState("")
  const [token] = useState(Cookies.get('JwtToken'))
  
  useEffect(()=>{
    let currentUser = currentChat.chatData.users.filter(user => user.userId == id)[0]
    setName(currentUser.name)
  }, [id])

  const getChatPhotoById = ()=>{
    fetch(`${import.meta.env.VITE_SERVER_API_URL}getChatPhotoById`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Barrer ${token}`,
        'ChatId':currentChat.chatId
      }
    })
    .then((res)=>{
      if(res.statusText == 'OK'){
        return res.blob()
      }else{
        console.error("No image")
      }
    })
    .then((info)=>{
      setPhotoSrc(URL.createObjectURL(info))
    })
    .catch((err)=>console.log(err))
  }

  useEffect(()=>{
    getChatPhotoById()
    let fullMessageState = focusedChat.messageState
    let fullFileState = focusedChat.fileState

    if(fullMessageState == "mixed"){ //Si focusedChat.messageState es mixed
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
            <p className="about-message-user-state-message">{messageStateText}</p>
            {fileStateText != "" &&
                <p className="about-message-user-state-file">{fileStateText}</p>
            }
        </div>
    </a>  
    </>
  )
}

export default AboutMessageUser