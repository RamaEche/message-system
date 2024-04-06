import './AddedUser.css'
import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'

function AddedUser( { Name, id, onClick } ){
  const [token] = useState(Cookies.get('JwtToken'))
  const [photoSrc, setPhotoSrc] = useState('https://us.123rf.com/450wm/tuktukdesign/tuktukdesign1606/tuktukdesign160600119/59070200-icono-de-usuario-hombre-perfil-hombre-de-negocios-avatar-icono-persona-en-la-ilustraci%C3%B3n.jpg')

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
      <div className='added-user-container' onClick={()=>onClick(id)}>
        <img className="added-user-chat-image" src={photoSrc}/>
        <img className="added-user-close" src='https://cdn-icons-png.flaticon.com/512/463/463612.png'/>
        <p>{Name}</p>
      </div>
  )
}

export default AddedUser