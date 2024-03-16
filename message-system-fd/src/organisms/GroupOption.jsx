import './GroupOption.css'
import {useState, useContext, useEffect, useRef} from 'react'
import {BoxesContext, CurrentChatContext} from "../pages/Home"
import { useForm } from 'react-hook-form'
import Confirmation from '../molecules/Confirmation'
import GroupUser from '../molecules/GroupUser'
import Cookies from 'js-cookie'

function GroupOption() {
  const { register, handleSubmit, formState, watch, setValue } = useForm()
  const [boxes, setBoxes] = useContext(BoxesContext)
  const [currentChat, setCurrentChat] = useContext(CurrentChatContext)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [serverDataGeted, setServerDataGeted] = useState(null)
  let err = formState.errors;
  let files = [];
  const form = useRef(null)
  const [formError, setFormError] = useState(false)
  const [chatImage, setChatImage] = useState('');
  const [openConfirmation1, setOpenConfirmation1] = useState(false)
  const [openConfirmation2, setOpenConfirmation2] = useState(false)
  const [token] = useState(Cookies.get("JwtToken"))

  const MessageBox = ()=>{
    setBoxes({box1:boxes.box1, box2:"MessageBox"})
  }

  watch('Name', '');
  watch('Description', '');

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
      setChatImage(URL.createObjectURL(info))
    })
    .catch((err)=>console.log(err))
  }

  const getGroupOptionData = ()=>{
    const token = Cookies.get("JwtToken")

    fetch(`${import.meta.env.VITE_SERVER_API_URL}getGroupOptionData`, {
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
    getGroupOptionData()
  }, [])

  //Resetear formulario con el nombre ya existente
  const resetForm = ()=>{
    form.current.reset();
    setValue('Name', serverDataGeted.name);
    setValue('Description', serverDataGeted.description);
    getChatPhotoById()
    //Poner a input de name el nombre puesto por el main user a ese user
  }

  useEffect(()=>{
    if(watch('Name') == ''){
      setValue('Name', serverDataGeted.name);
    }

    if(watch('Description') == ''){
      setValue('Description', serverDataGeted.description);
    }
  }, [serverDataGeted])

  //Subir formulario
  const submitForm = (e)=>{
    const formData = new FormData();
    formData.append('Name', e.Name)
    formData.append('Description', e.Description)
    formData.append('ChatImage', e.ChatImage[0])

    fetch(`${import.meta.env.VITE_SERVER_API_URL}UpdateGroup`, {
      method: 'POST',
      headers: {
        'authorization': `Barrer ${token}`,
        'ChatId':currentChat.chatId
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
            setFormError("Unknown error, try later.")
            console.error("Unknown error")
            break;
        }
      }
    })
    .catch((err)=>{console.error(err)})
  }

  const leaveTheGroup = ()=>{
    fetch(`${import.meta.env.VITE_SERVER_API_URL}postLeaveGroup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Barrer ${token}`
      },
      body: JSON.stringify({chatId:currentChat.chatId})
    })
    .then((res)=>res.json())
    .then((info)=>{
      setOpenConfirmation1(false)
      if(info.ok){
        location.href = import.meta.env.VITE_FRONTEND_APP_URL;
      }else{
        console.error(info)
      }
    })
  }

  const deleteGroup = ()=>{
    fetch(`${import.meta.env.VITE_SERVER_API_URL}postDeleteGroup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Barrer ${token}`
      },
      body: JSON.stringify({chatId:currentChat.chatId})
    })
    .then((res)=>res.json())
    .then((info)=>{
      setOpenConfirmation1(false)
      if(info.ok){
        location.href = import.meta.env.VITE_FRONTEND_APP_URL;
      }else{
        console.error(info)
      }
    })
  }

  useEffect(()=>{
    if(watch('ChatImage')){
      files.push(watch('ChatImage')[0])
      if(watch('ChatImage').length != 0){
        const reader = new FileReader();
  
        reader.onload = function (e) {
          setChatImage(e.target.result);
        };
    
        reader.readAsDataURL(watch('ChatImage')[0]);
      }
    }
  }, [watch('ChatImage')])

  const DeletePhoto = ()=>{
    form.current.reset();
    setChatImage('')
  }

  return (
    <div className='group-option-container'>
      <div className='group-option-bar'>
        <a className='group-option-go-back-arrow' onClick={()=>MessageBox()}><img src='arrow.png'/></a>
        <h1 className='group-option-outstanding-logo'>Text Message System</h1>
      </div>
      {serverDataGeted &&
        <>
          <form className='group-options-form-container' ref={form} onSubmit={handleSubmit((data)=>submitForm(data))}>
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
            <div className='group-options-profile'>
              <img className='group-options-profile-photo' src={chatImage || 'https://cdn-icons-png.flaticon.com/512/5989/5989226.png'}/>
              <div className='group-options-profile-data'>
                <input type='button' onClick={()=>DeletePhoto()} className='link' value='Delete photo'/>
                <div className='sing-in-image-selector link'>
                  <input type='file' name='ChatImage' {...register('ChatImage')}/>
                </div>
              </div>
            </div>
            <div className='group-options-container'>
                <p>Name</p>
                <input className='input-text group-input-text' type='text' name='Name' {...register('Name', { maxLength: 20, minLength: 4})}/>
                {err.Name &&
                  <div className='input-err-aclaration'>
                    <p>Este campo deve contener entre 4 y 15 caracteres</p>
                  </div>
                }
                <p>Description</p>
                <input className='input-text' type='text' name='Description' {...register('Description', { maxLength: 80, minLength: 1})}/>
                {err.Description &&
                  <div className='input-err-aclaration'>
                    <p>Este campo deve contener entre 1 y 80 caracteres</p>
                  </div>
                }
                <div className='group-options-form-changes-buttons'>
                  <input onClick={data=>resetForm(data)} type='reset'/>
                  <input className='main-button' type='submit'/>
                </div>
            </div>
          </form>
          <div className='group-options-bar-people-container'>
            { currentChat.chatData.users.map(({name, roll, userId})=>(
                <GroupUser key={userId} name={name} roll={roll} userId={userId}/>
              ))
            }
          </div>
          <button className='user-options-link link-red' onClick={()=>setOpenConfirmation1(true)}>Leave the group</button>
          <button className='user-options-link link-red' onClick={()=>setOpenConfirmation2(true)}>Delete group</button>
          {openConfirmation1 &&
            <Confirmation cbFalse={()=>setOpenConfirmation1(false)} cbTrue={()=>leaveTheGroup()} text="Are you sure you want to leave the group?"/>
          }
          {openConfirmation2 &&
            <Confirmation cbFalse={()=>setOpenConfirmation2(false)} cbTrue={()=>deleteGroup()} text="Are you sure you want to delete the group?"/>
          }
        </>
      }
    </div>
  )
}

export default GroupOption