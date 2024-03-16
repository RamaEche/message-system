import './ChatOption.css'
import {useState, useContext, useEffect, useRef} from 'react'
import {BoxesContext, CurrentChatContext} from "../pages/Home"
import { useForm } from 'react-hook-form'
import Confirmation from '../molecules/Confirmation'
import Cookies from 'js-cookie'

function ChatOption() {
  const { register, handleSubmit, formState, watch, setValue } = useForm()
  const [boxes, setBoxes] = useContext(BoxesContext)
  const [currentChat, setCurrentChat] = useContext(CurrentChatContext)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [serverDataGeted, setServerDataGeted] = useState(null)
  let err = formState.errors;
  const form = useRef(null)
  const [formError, setFormError] = useState(false)
  const [photoSrc, setPhotoSrc] = useState('https://us.123rf.com/450wm/tuktukdesign/tuktukdesign1606/tuktukdesign160600119/59070200-icono-de-usuario-hombre-perfil-hombre-de-negocios-avatar-icono-persona-en-la-ilustraci%C3%B3n.jpg')

  const MessageBox = ()=>{
    setBoxes({box1:boxes.box1, box2:"MessageBox"})
  }

  watch('Name', '');

  const getChatPhotoById = ()=>{
    const token = Cookies.get("JwtToken")
    fetch(`${import.meta.env.VITE_SERVER_API_URL}getChatPhotoById`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Barrer ${token}`,
        'ChatId':currentChat.chatId
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

  const getChatOptionData = ()=>{
    const token = Cookies.get("JwtToken")
    fetch(`${import.meta.env.VITE_SERVER_API_URL}getChatOptionData`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Barrer ${token}`,
        'ChatId':currentChat.chatId
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
      setServerDataGeted(info)
    })
    .catch((err)=>console.error(err))
  }

  useEffect(()=>{
    //cargar imagen de usuario
    getChatPhotoById()

    //cargar username del usuario
    //cargar descripcion del usuario
    //cargar nombre del usuario
    getChatOptionData()
  }, [])

  //Resetear formulario con el nombre ya existente
  const resetForm = ()=>{
    form.current.reset();
    setValue('Name', serverDataGeted.name);
    //Poner a input de name el nombre puesto por el main user a ese user
  }

  useEffect(()=>{
    if(watch('Name') == ''){
      setValue('Name', serverDataGeted.name);
    }
  }, [serverDataGeted])

  //Subir formulario
  const submitForm = (e)=>{
    const token = Cookies.get("JwtToken")
    fetch(`${import.meta.env.VITE_SERVER_API_URL}postChangeName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Barrer ${token}`,
        'ChatId':currentChat.chatId
      },
      body:JSON.stringify({
        name: e.Name
      })
    })
   .then((res)=>{
     if(res.statusText == 'OK'){
       return res.json()
     }else{
       console.error(res)
     }
   })
   .then((info)=>{
     location.href = import.meta.env.VITE_FRONTEND_APP_URL;
   })
   .catch((err)=>console.error(err))
  }

  //Bloquear usuario (solo el chat privado, no los grupos)
  const blockUser = ()=>{
    setOpenConfirmation(false)

    const token = Cookies.get("JwtToken")
    fetch(`${import.meta.env.VITE_SERVER_API_URL}getBlockUser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Barrer ${token}`,
        'ChatId':currentChat.chatId
      }
    })
    .then((res)=>{
      if(res.statusText == 'OK'){
        return res
      }else{
        console.error("No image")
      }
    })
    .then((info)=>{
      console.log(info)
      location.href = import.meta.env.VITE_FRONTEND_APP_URL;
    })
    .catch((err)=>console.error(err))
  }

  return (
    <div className='chat-option-container'>
      <div className='chat-option-bar'>
        <a className='chat-option-go-back-arrow' onClick={()=>MessageBox()}><img src='arrow.png'/></a>
        <h1 className='chat-option-outstanding-logo'>Text Message System</h1>
      </div>
      {serverDataGeted &&
        <form className='chat-options-form-container' ref={form} onSubmit={handleSubmit((data)=>submitForm(data))}>
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
          <div className='chat-options-profile'>
            <img className='chat-options-profile-photo' src={photoSrc}/>
            <div className='chat-options-profile-data'>
              <h3>{serverDataGeted ? serverDataGeted.userName : ''}</h3>
              <p>{serverDataGeted ? serverDataGeted.description : ''}</p>
              <p className='user-storage'></p>
            </div>
          </div>
          <div className='chat-options-container'>
              <p>Name</p>
              <input className='input-text' type='text' name='Name' {...register('Name', { maxLength: 15, minLength: 4})}/>
              {err.Name &&
                <div className='input-err-aclaration'>
                  <p>Este campo deve contener entre 4 y 15 caracteres</p>
                </div>
              }
              <div className='chat-options-form-changes-buttons'>
                <input onClick={handleSubmit(data=>resetForm(data))} type='reset'/>
                <input className='main-button' type='submit'/>
              </div>
          </div>
        </form>
      }
      {/*<button className='chat-options-link link' onClick={()=>setOpenConfirmation(true)}>block user</button>*/}
      {/* {openConfirmation &&
        <Confirmation cbFalse={()=>setOpenConfirmation(false)} cbTrue={()=>blockUser()} text="Are you sure you want to block this user?"/>
      }*/}
      {/* <button className='chat-options-link link' href='/LogIn'></button> */}
    </div>
  )
}

export default ChatOption