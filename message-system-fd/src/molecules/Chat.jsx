import './Chat.css'
import {useState, useContext, useEffect, useRef} from 'react'
import {BoxesContext} from '../pages/Home'
import Cookies from 'js-cookie'

function Chat({ChatID, Type, Name, Description, UserCurrentState,  IgnoredMessageCounter}) {

  const mounted = useRef(false);
  const [boxes, setBoxes] = useContext(BoxesContext)
  const [chatID, setCatID] = useState(ChatID)
  const [type, setType] = useState(Type)
  const [photoSrc, setPhotoSrc] = useState('https://us.123rf.com/450wm/tuktukdesign/tuktukdesign1606/tuktukdesign160600119/59070200-icono-de-usuario-hombre-perfil-hombre-de-negocios-avatar-icono-persona-en-la-ilustraci%C3%B3n.jpg')

  const OpenChat = ()=>{
    setBoxes({box1:boxes.box1, box2:"MessageBox"})
  }

  const getChatPhotoById = ()=>{
    const token = Cookies.get("JwtToken")
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
        console.error("No image")
      }
    })
    .then((info)=>{
      setPhotoSrc(URL.createObjectURL(info))
    })
    .catch((err)=>console.log(err))
  }

  useEffect(()=>{
    if (!mounted.current) {
    getChatPhotoById()
    mounted.current = true;
    }
  }, []);

  return (
    <a onClick={()=>OpenChat()} className='chat-box'>
        <div className='chat-content'>
            <div className='chat-data'>
                <img className="image" src={photoSrc}/>
                <div className='chat-text'>
                    <p className="name">{Name}</p>
                    <p className="last-message">{Description}</p>
                </div>
            </div>
            <div className='notifications'>
                {IgnoredMessageCounter >= 1 && <div className='green-circle-notification'>{IgnoredMessageCounter}</div>}
                {Type == "U" && <div className={UserCurrentState == 'ON' ? 'blue-circle-notification' : 'gray-circle-notification'}></div>}
            </div>
        </div>
    </a>
  )
}

export default Chat