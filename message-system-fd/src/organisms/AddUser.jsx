import './AddUser.css'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import Cookies from 'js-cookie'
import GoBackArrow from '../atoms/GoBackArrow'

function AddUser({ webSocket, newUserToAdd }) {
  const [token] = useState(Cookies.get('JwtToken'))
  const [formError, setFormError] = useState(false)
  const {handleSubmit, register, formState} = useForm()
  let err = formState.errors;

  const addUser = (e)=>{
    webSocket.emit("postAddUser", {
      authorization: `Barrer ${token}`,
      id:newUserToAdd.id,
      name:e.name
    });
    webSocket.on("postAddUser", info=>{
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
  }

  return (
    <div className='add-user-container'>
      <div className='add-user-bar'>
        <GoBackArrow changeTo="Chats" boxNumber={1}/>
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
                <p>This field must contain between 4 and 15 characters</p>
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