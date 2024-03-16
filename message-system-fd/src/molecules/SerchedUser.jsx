import './SerchedUser.css'
import {useState, useEffect, useContext} from 'react'
import Cookies from 'js-cookie'
import {BoxesContext} from '../pages/Home'


function SerchedUser( { id, userName, userDescription, setNewUserToAdd } ){
    const [boxes, setBoxes] = useContext(BoxesContext)
    const [photoSrc, setPhotoSrc] = useState('https://us.123rf.com/450wm/tuktukdesign/tuktukdesign1606/tuktukdesign160600119/59070200-icono-de-usuario-hombre-perfil-hombre-de-negocios-avatar-icono-persona-en-la-ilustraci%C3%B3n.jpg')

    const AddUser = ()=>{
      setNewUserToAdd({id:id, userImage:photoSrc, userName:userName, userDescription:userDescription})
      setBoxes({box1:"AddUser", box2:boxes.box2})
    }

    const getUserPhotoById = ()=>{
        const token = Cookies.get("JwtToken")
        fetch(`${import.meta.env.VITE_SERVER_API_URL}getUserPhotoById`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Barrer ${token}`,
            'UserId':id
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

    useEffect(()=>{
      getUserPhotoById()
    }, [id])

    return (
        <div className='searched-user' onClick={()=>AddUser()}>
            <img className='searched-user-img' src={photoSrc}/>
            <p className='searched-user-user'>@{userName}</p>
        </div>
    )
}

export default SerchedUser