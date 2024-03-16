import './AddUser.css'
import {useState, useContext} from 'react'
import {BoxesContext} from "../pages/Home"
import {useForm} from 'react-hook-form'
import Cookies from 'js-cookie'

function AddUser({ newUserToAdd }) {
  const [boxes, setBoxes] = useContext(BoxesContext)
  const [formError, setFormError] = useState(false)
  const {handleSubmit, register, formState} = useForm()
  let err = formState.errors;

  const Chats = ()=>{
    setBoxes({box1:"Chats", box2:boxes.box2})
  }

  const addUser = (e)=>{
    const token = Cookies.get("JwtToken")
    fetch(`${import.meta.env.VITE_SERVER_API_URL}postAddUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Barrer ${token}`
      },
      body: JSON.stringify({
        id:newUserToAdd.id,
        name:e.name
      })
    })
    .then(res=>res.json())
    .then((info)=>{
      if(info.ok){
        location.href = import.meta.env.VITE_FRONTEND_APP_URL;
      }else{
        console.error(info)
        switch (info.err) {
          case "chatInCommon":
            setFormError("You already have a chat with this user.")
            break;
          default:
            setFormError("Unknown error, try later.")
            console.error("Unknown error")
            break;
        }
      }
    })
    .catch((err)=>console.error(err))
  }

  return (
    <div className='add-user-container'>
      <div className='add-user-bar'>
        <a className='add-user-go-back-arrow' onClick={()=>Chats()}><img src='arrow.png'/></a>
        <h1 className='add-user-outstanding-logo'>Text Message System</h1>
      </div>
      <form className='add-users-form-container' onSubmit={handleSubmit((e)=>addUser(e))}>
        <div className='add-users-profile-photo'>
          <img className='user-image-selector' src={ newUserToAdd.userImage }/>
          <p className='add-user-user-name'>{ newUserToAdd.userName }</p>
          <p className='add-user-description'>{ newUserToAdd.userDescription }</p>
        </div>
        {formError &&
          <div className='form-err-aclaration'>
            <p>{formError}</p>
          </div>
        }
        <div className='add-users-container'>
            <p>Name</p>
            <input className='input-text' type='text' name="name" {...register("name", {required: true, maxLength: 15, minLength: 4})}/>
            {err.name &&
              <div className='input-err-aclaration'>
                <p>Este campo deve contener entre 4 y 15 caracteres</p>
              </div>
            }
            <div className='add-users-form-changes-buttons'>
              <input type='submit' className='main-button' value="Talk"/>
            </div>
        </div>
      </form>
    </div>
  )
}

export default AddUser