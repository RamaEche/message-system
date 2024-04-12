import './AddedUser.css'
import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'

function AddedUser( { Name, id, onClick } ){
  const [token] = useState(Cookies.get('JwtToken'))
  const [photoSrc, setPhotoSrc] = useState(`${import.meta.env.VITE_FRONTEND_APP_URL}group.png`)

  const getChatPhotoById = ()=>{
    fetch(`${import.meta.env.VITE_SERVER_API_URL}getChatPhotoById`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Barrer ${token}`,
        'ChatId':id
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
    getChatPhotoById()
  }, []);

  return (
    <>
      <div className='added-user-container-curtain-remove' onClick={()=>onClick(id)}>
        <img className="added-user-close" src={`${import.meta.env.VITE_FRONTEND_APP_URL}close.png`}/>
      </div>
      <div className='added-user-container'>
        <img className="added-user-chat-image" src={photoSrc}/>
        <p>{Name}</p>
      </div>
    </>
  )
}

export default AddedUser