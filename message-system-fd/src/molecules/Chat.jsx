import './Chat.css'
import {useState, useContext, useEffect, useRef} from 'react'
import {BoxesContext, CurrentChatContext} from '../pages/Home'
import Cookies from 'js-cookie'

function Chat({onClick=false, socket, ChatID, Type, Name, Description, IgnoredMessageCounter}) {

  const mounted = useRef(false);
  const [boxes, setBoxes] = useContext(BoxesContext)
  const [ignoredMessages, setIgnoredMessages] = useState(IgnoredMessageCounter)
  const [chatState, setChatState] = useState(false)
  const [, setCurrentChat] = useContext(CurrentChatContext)
  const [photoSrc, setPhotoSrc] = useState(`${import.meta.env.VITE_FRONTEND_APP_URL}group.png`)
  const [token] = useState(Cookies.get('JwtToken'))

  
  const OpenChat = ()=>{
    setBoxes({box1:boxes.box1, box2:"MessageBox"})
    setCurrentChat(currentChatData =>{
      currentChatData.chatId = ChatID
      currentChatData.chatType = Type
      return currentChatData
    })
    setIgnoredMessages(0)
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
      if(res.statusText == 'OK'){
        return res.blob()
      }else{
        return res.json()
      }
    })
    .then((info)=>{
      if(!info.msg){
        setPhotoSrc(URL.createObjectURL(info))
      }
    })
    .catch((err)=>console.log(err))
  }

  useEffect(()=>{
    if (!mounted.current) {
      getChatPhotoById()
      mounted.current = true;
    }

    socket.on('updateUserChatCurrentStatus', data=>{
      if(ChatID == data.chatId){
        setChatState(data.state)
      }
    })
  }, []);

  useEffect(()=>{
    getChatPhotoById()
  }, [ChatID])

  return (
    <a onClick={onClick ? ()=>onClick(ChatID) : ()=>OpenChat()} className='chat-box'>
        <div className='chat-content'>
            <div className='chat-data'>
                <img className="chat-image" src={photoSrc}/>
                <div className='chat-text'>
                    <p className="chat-name">{Name}</p>
                    <p className="last-message">{Description}</p>
                </div>
            </div>
            <div className='notifications'>
                {ignoredMessages >= 1 && <div className='green-circle-notification'>{ignoredMessages}</div>}
                {Type == "U" && <div className={chatState == true ? 'blue-circle-notification' : 'gray-circle-notification'}></div>}
            </div>
        </div>
    </a>
  )
}

export default Chat