import './ChatOption.css'
import {useState, useContext, useEffect, useRef} from 'react'
import {CurrentChatContext} from "../pages/Home"
import { useForm } from 'react-hook-form'
import Cookies from 'js-cookie'
import GoBackArrow from '../atoms/GoBackArrow'

function ChatOption({ webSocket }) {
  const [token] = useState(Cookies.get('JwtToken'))
  const { register, handleSubmit, formState, watch, setValue } = useForm()
  const [currentChat] = useContext(CurrentChatContext)
  const [serverDataGeted, setServerDataGeted] = useState(null)
  let err = formState.errors;
  const form = useRef(null)
  const [formError] = useState(false)
  const [photoSrc, setPhotoSrc] = useState(`${import.meta.env.VITE_FRONTEND_APP_URL}group.png`)

  watch('Name', '');

  const getChatPhotoById = ()=>{
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
        console.error(res.statusText)
      }
    })
    .then((info)=>{
      setPhotoSrc(URL.createObjectURL(info))
    })
    .catch((err)=>console.log(err))
  }

  const getChatOptionData = ()=>{
    webSocket.emit("getChatOptionData", {
      authorization: `Barrer ${token}`,
      chatId:currentChat.chatId
    });
    webSocket.on("getChatOptionData", info=>{
      setServerDataGeted(info)
    })
  }

  useEffect(()=>{
    //Upload user image.
    getChatPhotoById()

    //Load username of the user.
    //Upload user description.
    //Load username.
    getChatOptionData()
  }, [])

  //Reset form with the existing name.
  const resetForm = ()=>{
    form.current.reset();
    setValue('Name', serverDataGeted.name);
    //Set name input to the name given by the main user to that user.
  }

  useEffect(()=>{
    if(watch('Name') == ''){
      setValue('Name', serverDataGeted.name);
    }
  }, [serverDataGeted])

  //Subir formulario
  const submitForm = (e)=>{
    webSocket.emit("postChangeName", {
      authorization: `Barrer ${token}`,
      chatId:currentChat.chatId,
      name: e.Name
    });
    webSocket.on("postChangeName", ()=>{
      location.href = import.meta.env.VITE_FRONTEND_APP_URL;
    })
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
   .then(()=>{
     location.href = import.meta.env.VITE_FRONTEND_APP_URL;
   })
   .catch((err)=>console.error(err))
  }

  //Block user (private chat only, not groups)
/*   const blockUser = ()=>{
    setOpenConfirmation(false)

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
  } */

  return (
    <div className='chat-option-container'>
      <div className='chat-option-bar'>
        <GoBackArrow changeTo="MessageBox" boxNumber={2}/>
        <h1 className='chat-option-outstanding-logo'>Text Message System</h1>
      </div>
      {serverDataGeted &&
        <form className='chat-options-form-container' ref={form} onSubmit={handleSubmit((data)=>submitForm(data))}>
          <div>
            {formError &&
              <div className='form-err-aclaration'>
                <p>{formError}</p>
              </div>
            }
            {err.ProfileImage &&
            <div className='form-err-aclaration sing-in-form-err-aclaration'>
                <p>Profile photo error.</p>
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
                    <p>This field must contain between 4 and 15 characters.</p>
                  </div>
                }
                <div className='chat-options-form-changes-buttons'>
                  <input className='reset-button' onClick={handleSubmit(data=>resetForm(data))} type='reset' value="Reset"/>
                  <input className='main-button send-button' type='submit' value="Send"/>
                </div>
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