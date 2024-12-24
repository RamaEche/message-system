import './GroupUser.css'
import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'

function GroupUser({ name, roll, userId, chatsStatus, chats, CurrentUserId }) {
  const [userCurrentState, setUserCurrentState] = useState(false)
  const [photoSrc, setPhotoSrc] = useState(`${import.meta.env.VITE_FRONTEND_APP_URL}user.webp`)
  const [token] = useState(Cookies.get('JwtToken'))
  
  const getUserPhotoById = ()=>{
    fetch(`${import.meta.env.VITE_SERVER_API_URL}getUserPhotoById`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Barrer ${token}`,
        'UserId':userId
      }
    })
    .then((res)=>{
      if(res.statusText == 'OK'){
        return res.json()
      }else{
        console.error("No image")
      }
    })
    .then((info)=>{
      if(info.msg) setPhotoSrc(info.msg)
    })
    .catch((err)=>console.error(err))
  }

  useEffect(()=>{
    getUserPhotoById()
  }, [])

  const reloadState = ()=>{
    if(userId != CurrentUserId){
      const currentChatIdex = chats.findIndex(i=>i.UserChatPerspectiveLinkId == userId)
      const currentChatsStatusIndex = chatsStatus.findIndex(i=>i.chatId == chats[currentChatIdex].id)
      
      if(currentChatsStatusIndex != -1){
        setUserCurrentState(chatsStatus[currentChatsStatusIndex].state)
      }else{
        setUserCurrentState(false)
      }
    }else{
      setUserCurrentState(true)
    }
  }

  useEffect(()=>{
    reloadState()
  },[chatsStatus])

  return (
    <>
    <a className='group-user-user-box' >
        <div className='group-user-user-content'>
            <div className='group-user-user-data'>
                <img className="group-user-user-image" src={photoSrc}/>
                <div className='group-user-user-text'>
                    <p className="group-user-user-name">{name}</p>
                </div>
            </div>
        </div>
        <div className='group-user-user-states'>
            {roll == "A" &&
              <p className="group-user-user-state-message">admin</p>
            }
            <div className={userCurrentState == true ? 'blue-circle-notification' : 'gray-circle-notification'}></div>
        </div>
    </a>  
    </>
  )
}

export default GroupUser