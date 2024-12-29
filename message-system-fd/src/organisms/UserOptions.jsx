import './UserOptions.css'
import {useState, useRef, useEffect} from 'react'
import { useForm } from 'react-hook-form'
import Confirmation from '../molecules/Confirmation'
import Cookies from 'js-cookie'
import errorManager from  '../controllers/errorManager.js'
import socketIOClient from 'socket.io-client';
import GoBackArrow from '../atoms/GoBackArrow.jsx'

function UserOptions({ setWebSocket, boxLoaded }) {
  const { register, handleSubmit, formState, watch, setValue } = useForm()
  let files = [];
  let err = formState.errors;
  const [formError, setFormError] = useState(false)
  const form = useRef(null)
  const [originalData, setOriginalData] = useState({photoSrc:null, userName:null, description:null})
  const [photoSrc, setPhotoSrc] = useState(null)
  const [openConfirmation1, setOpenConfirmation1] = useState(false)
  const [openConfirmation2, setOpenConfirmation2] = useState(false)
  const [token] = useState(Cookies.get('JwtToken'))

  watch("UserName", "")
  watch("Description", "")

  const socket = socketIOClient(`${import.meta.env.VITE_SERVER_API_URL}`);

  const getUserPhotoById = id=>{
    fetch(`${import.meta.env.VITE_SERVER_API_URL}getUserPhotoById`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Barrer ${token}`,
        'UserId':id
      }
    })
    .then((res)=>{
      if(res.ok){
        return res.json()
      }else{
        console.error("No image")
      }
    })
    .then((info)=>{
      if(info.msg){
        setPhotoSrc(info.msg)
        setOriginalData(infoSrc=>({
          ...infoSrc,
          photoSrc: info.msg
        }))
      }else{
        setPhotoSrc(`${import.meta.env.VITE_FRONTEND_APP_URL}user.webp`)
        setOriginalData(infoSrc=>({
          ...infoSrc,
          photoSrc: `${import.meta.env.VITE_FRONTEND_APP_URL}user.webp`
        }))
      }
    })
    .catch((err)=>console.error(err))
  }

  const onSubmit = (e)=>{
    const formData = new FormData();
    photoSrc != `${import.meta.env.VITE_FRONTEND_APP_URL}user.webp` ? formData.append('ProfileImage', e.ProfileImage[0]) : formData.append('ProfileImage', "none")
    formData.append('UserName', e.UserName)
    formData.append('Description', e.Description)

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
        errorManager(info, setFormError)
      }
    })
    .catch((err)=>{console.error(err)})
  }

  useEffect(()=>{
    files.push(watch('ProfileImage')[0])
    if(watch('ProfileImage').length != 0){
      const reader = new FileReader();

      reader.onload = function (e) {
        setPhotoSrc(e.target.result);
      };
  
      reader.readAsDataURL(watch('ProfileImage')[0]);
    }
  }, [watch('ProfileImage')])

  const deletePhoto = ()=>{
    const CurrentUserName = watch('UserName')
    const CurrentDescription = watch('Description')
    form.current.reset();
    setPhotoSrc(`${import.meta.env.VITE_FRONTEND_APP_URL}user.webp`)
    setValue('UserName', CurrentUserName);
    setValue('Description', CurrentDescription);
  }

  const resetForm = ()=>{
    form.current.reset();
    setPhotoSrc(originalData.photoSrc != null ? originalData.photoSrc : `${import.meta.env.VITE_FRONTEND_APP_URL}user.webp`)
    setValue('UserName', originalData.userName);
    setValue('Description', originalData.description);
  }

  const closeAccount = ()=>{
    Cookies.remove("JwtToken")
    location.href = import.meta.env.VITE_FRONTEND_APP_URL;
    setOpenConfirmation2(false)
  }

  const removeAccount = ()=>{
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
        errorManager(info, setFormError)
        setOpenConfirmation1(false)
      }
    })
  }

  useEffect(()=>{
    setWebSocket(socket)
    socket.emit('getUserOptions', {authorization:`Barrer ${token}`})
    socket.on('getUserOptions', data => {
      setValue('UserName', data.info.userName);
      setValue('Description', data.info.description);
      getUserPhotoById(data.info.id)
      setOriginalData(infoSrc=>({
        ...infoSrc,
        userName: data.info.userName,
        description: data.info.description
      }))
    });
  }, [])

  return (
    <div className='user-option-container'>
      <div className='user-option-bar'>
        <GoBackArrow changeTo="Chats" boxNumber={1}/>
        <h1 className='user-option-outstanding-logo'>Text Message System</h1>
      </div>
      <div className='user-option-content'>
        <form className='user-options-form-container' ref={form} onSubmit={handleSubmit((data)=>onSubmit(data))}>
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
          <img className='user-options-image-selector' src={photoSrc} onLoad={()=>{boxLoaded(1)}}/>
          <div className='image-selector-buttons'>
            <input type='button' onClick={()=>deletePhoto()} className='link' value='Delete photo'/>
            <div className='sing-in-image-selector link'>
              <input type='file' name='ProfileImage' {...register('ProfileImage')}/>
            </div>
          </div>
          <div className='user-options-container'>
              <p>Username</p>
              <input className='input-text' type='text' name='UserName' {...register('UserName', { required:true, maxLength: 15, minLength: 4})}/>
              {err.UserName &&
                <div className='input-err-aclaration'>
                  <p>This field must contain between 4 and 15 characters.</p>
                </div>
              }
              <p>Description</p>
              <input className='input-text' type='text' name='Description' {...register('Description', { maxLength: 100})}/>
              {err.Description &&
                <div className='input-err-aclaration'>
                  <p>This field must contain a maximum of 100 characters.</p>
                </div>
              }
              <div className='user-options-form-changes-buttons'>
                <input onClick={()=>resetForm()} type='button' className='reset-button' value="Reset"/>
                <input className='user-options-submit reset-button' type='submit' value="Send"/>
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
    </div>
  )
}

export default UserOptions