import './GroupUser.css'
import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'

function GroupUser({name, roll, userId}) {
  const [userCurrentState] = useState(false)
  const [photoSrc, setPhotoSrc] = useState('https://us.123rf.com/450wm/tuktukdesign/tuktukdesign1606/tuktukdesign160600119/59070200-icono-de-usuario-hombre-perfil-hombre-de-negocios-avatar-icono-persona-en-la-ilustraci%C3%B3n.jpg')
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
    getUserPhotoById()
  }, [])

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