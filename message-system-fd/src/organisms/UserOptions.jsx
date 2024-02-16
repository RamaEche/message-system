import './UserOptions.css'
import {useState, useContext, useRef, useEffect} from 'react'
import {BoxesContext} from "../pages/Home"
import { useForm } from 'react-hook-form'
import Confirmation from '../molecules/Confirmation'
import Cookies from 'js-cookie'

function UserOptions() {
  const [boxes, setBoxes] = useContext(BoxesContext)
  const { register, handleSubmit, formState, watch } = useForm()
  const [profileImage, setProfileImage] = useState('');
  let files = [];
  let err = formState.errors;
  const [formError, setFormError] = useState(false)
  const form = useRef(null)
  const [openConfirmation1, setOpenConfirmation1] = useState(false)
  const [openConfirmation2, setOpenConfirmation2] = useState(false)

  const Chats = ()=>{
    setBoxes({box1:"Chats", box2:boxes.box2})
  }

  const onSubmit = (e)=>{
    const formData = new FormData();
    formData.append('ProfileImage', e.ProfileImage[0])
    formData.append('UserName', e.UserName)

    const token = Cookies.get("JwtToken")
    fetch(`${import.meta.env.VITE_SERVER_API_URL}UpdateProfile`, {
      method: 'POST',
      headers:{
        'authorization': `Barrer ${token}`
      },
      body: formData
    })
    .then((res)=>res.json())
    .then((info)=>{
      if(info.ok){
        location.href = import.meta.env.VITE_FRONTEND_APP_URL;
      }else{
        console.error(info)
        switch (info.err) {
          case "ValidTokenInvalidUser":
            setFormError("Valid token but invalid user.")
            break;
          case "invalidInputs":
            setFormError("The format is invalid.")
            break;
          case "diferentPassword":
            setFormError("The password and validation password are different from each other.")
            break;
          case "alreadyRegistered":
            setFormError("This username is in use. try another.")
            break;
          case "impossibleImageUpdate":
            setFormError("Some problem on the server makes it impossible to update the image.")
            break;
          default:
            console.error("Unknown error")
            break;
        }
      }
    })
    .catch((err)=>{console.error(err)})
  }

  useEffect(()=>{
    files.push(watch('ProfileImage')[0])
    if(watch('ProfileImage').length != 0){
      const reader = new FileReader();

      reader.onload = function (e) {
        setProfileImage(e.target.result);
      };
  
      reader.readAsDataURL(watch('ProfileImage')[0]);
    }
  }, [watch('ProfileImage')])

  const DeletePhoto = ()=>{
    form.current.reset();
    setProfileImage('')
  }

  const closeAccount = ()=>{
    Cookies.remove("JwtToken")
    location.href = import.meta.env.VITE_FRONTEND_APP_URL;
    setOpenConfirmation2(false)
  }

  const removeAccount = ()=>{
    const token = Cookies.get("JwtToken")
    fetch(`${import.meta.env.VITE_SERVER_API_URL}removeUser`, {
      method: 'POST',
      headers:{
        'authorization': `Barrer ${token}`
      }
    })
    .then((res)=>res.json())
    .then((info)=>{
      if(info.ok){
        Cookies.remove("JwtToken")
        location.href = import.meta.env.VITE_FRONTEND_APP_URL;
        setOpenConfirmation1(false)
      }else{
        console.error(info)
        switch (info.err) {
          case "ValidTokenInvalidUser":
            setFormError("Valid token but invalid user.")
            break;
          case "impossibleRemoveAccount":
            setFormError("Impossible remove account.")
          default:
            console.error("Unknown error")
            break;
        }
        setOpenConfirmation1(false)
      }
    })
  }
  return (
    <div className='user-option-container'>
      <div className='user-option-bar'>
        <a className='user-option-go-back-arrow' onClick={()=>Chats()}><img src='arrow.png'/></a>
        <h1 className='user-option-outstanding-logo'>Text Message System</h1>
      </div>
      <form className='user-options-form-container' ref={form} onSubmit={handleSubmit((data)=>onSubmit(data))}>
        {formError &&
          <div className='form-err-aclaration'>
            <p>{formError}</p>
          </div>
        }
        {err.ProfileImage &&
        <div className='form-err-aclaration sing-in-form-err-aclaration'>
            <p>Error en la foto de perfil</p>
          </div>
        }
        <img className='user-image-selector' src={profileImage || 'https://cdn-icons-png.flaticon.com/512/5989/5989226.png'}/>
        <div className='image-selector-buttons'>
          <input type='button' onClick={()=>DeletePhoto()} className='link' value='Delete photo'/>
          <div className='sing-in-image-selector link'>
            <input type='file' name='ProfileImage' {...register('ProfileImage')}/>
          </div>
        </div>
        <div className='user-options-container'>
            <p>Username</p>
            <input className='input-text' type='text' name='UserName' {...register('UserName', { maxLength: 15, minLength: 4})}/>
            {err.UserName &&
              <div className='input-err-aclaration'>
                <p>Este campo deve contener entre 4 y 15 caracteres</p>
              </div>
            }
            <div className='user-options-form-changes-buttons'>
              <input onClick={()=>DeletePhoto()} type='reset'/>
              <input className='user-options-submit' type='submit'/>
            </div>
        </div>
      </form>
      <a className='user-options-link link' href='/restorePassword'>Change password</a>
      <button className='user-options-link link' onClick={()=>setOpenConfirmation2(true)}>Close account</button>
      <button className='user-options-link link' onClick={()=>setOpenConfirmation1(true)}>Remove account</button>
      {openConfirmation1 &&
        <Confirmation cbFalse={()=>setOpenConfirmation1(false)} cbTrue={()=>removeAccount()} text="Are you sure you want to delete the account?"/>
      }
      {openConfirmation2 &&
        <Confirmation cbFalse={()=>setOpenConfirmation2(false)} cbTrue={()=>closeAccount()} text="Are you sure you want to close the account?"/>
      }
    </div>
  )
}

export default UserOptions