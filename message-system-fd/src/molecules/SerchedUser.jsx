import './SerchedUser.css'
import {useState, useEffect, useContext} from 'react'
import Cookies from 'js-cookie'
import {BoxesContext} from '../pages/Home'


function SerchedUser( { id, userName, userDescription, setNewUserToAdd } ){
    const [boxes, setBoxes] = useContext(BoxesContext)
    const [photoSrc, setPhotoSrc] = useState(`${import.meta.env.VITE_FRONTEND_APP_URL}user.png`)
    const [token] = useState(Cookies.get('JwtToken'))
    
    const AddUser = ()=>{
      setNewUserToAdd({id:id, userImage:photoSrc, userName:userName, userDescription:userDescription})
      setBoxes({box1:"AddUser", box2:boxes.box2})
    }

    const getUserPhotoById = ()=>{
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