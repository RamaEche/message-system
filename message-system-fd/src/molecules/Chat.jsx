import './Chat.css'
import {useState, useContext, useEffect} from 'react'
import {BoxesContext, CurrentChatContext} from '../pages/Home'
import Cookies from 'js-cookie'

function Chat({className="", setClicked=false, onClick=false, chatsStatus, ChatID, Type, Name, Description, IgnoredMessageCounter, chatsImage, setChatsImage}) {
  const [boxes, setBoxes] = useContext(BoxesContext)
  const [ignoredMessages, setIgnoredMessages] = useState(IgnoredMessageCounter)
  const [chatState, setChatState] = useState(false)
  const [, setCurrentChat] = useContext(CurrentChatContext)
  const [photoSrc, setPhotoSrc] = useState(`${import.meta.env.VITE_FRONTEND_APP_URL}group.png`)
  const [token] = useState(Cookies.get('JwtToken'))
  
  const OpenChat = ()=>{
    setCurrentChat(currentChatData =>({
      ...currentChatData,
      chatId: ChatID,
      chatType: Type,
    }))
    setBoxes({box1:boxes.box1, box2:"MessageBox", currentBox:2})
    setIgnoredMessages(0)
    setClicked != false && setClicked(ChatID)
  }
  
  useEffect(()=>{
    setIgnoredMessages(IgnoredMessageCounter)
  },[IgnoredMessageCounter])

  const getChatPhotoById = ()=>{
    fetch(`${import.meta.env.VITE_SERVER_API_URL}getChatPhotoById`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Barrer ${token}`,
        'ChatId':ChatID
      }
    })
    .then((res)=>{
      return res.json()
    })
    .then((info)=>{
      if(info.state == 200){
        if(info.msg){
          setPhotoSrc(info.msg)
          setChatsImage(currentChatsImage=>{
            return [...currentChatsImage, {chatID:ChatID, src:info.msg}]
          })
        }
      }else if(info.state == 500){
        if(Type == "G"){
          setPhotoSrc(`${import.meta.env.VITE_FRONTEND_APP_URL}group.png`)
          setChatsImage(currentChatsImage=>[...currentChatsImage, {chatID:ChatID, src:`${import.meta.env.VITE_FRONTEND_APP_URL}group.png`}])
        }else{
          setPhotoSrc(`${import.meta.env.VITE_FRONTEND_APP_URL}user.png`)
          setChatsImage(currentChatsImage=>[...currentChatsImage, {chatID:ChatID, src:`${import.meta.env.VITE_FRONTEND_APP_URL}user.png`}])
        }
      }
    })
    .catch((err)=>console.error(err))
  }

  const setImage = ()=>{
    let posibleImgIndx = chatsImage.findIndex(i=>i.chatID == ChatID)
    if(posibleImgIndx != -1){
      setPhotoSrc(chatsImage[posibleImgIndx].src)
    }else{
      getChatPhotoById()
    }
  }

  useEffect(()=>{
    setImage()
  }, [ChatID])

  useEffect(()=>{
    if(chatsStatus){
      const chatInx = chatsStatus.findIndex(i=>{
        return i.chatId == ChatID
      })
      
      if(chatInx != -1){
        setChatState(chatsStatus[chatInx].state)
      }
    }
  },[chatsStatus])

  return (
    <a onClick={onClick ? ()=>onClick(ChatID) : ()=>OpenChat()} className={'chat-box '+className}>
        <div className='chat-content'>
            <div className='chat-data'>
                <img className="chat-image" src={photoSrc}/>
                <div className='chat-text'>
                    <p className="chat-name">{Name}</p>
                    <p className="last-message">{Description}</p>
                </div>
            </div>
            <div className='notifications'>
                {setClicked != false && ignoredMessages >= 1 && <div className='green-circle-notification'>{ignoredMessages}</div>}
                {setClicked != false &&  Type == "U" && <div className={chatState == true ? 'blue-circle-notification' : 'gray-circle-notification'}></div>}
            </div>
        </div>
    </a>
  )
}

export default Chat