import './SingIn.css'
import {useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Cookies from 'js-cookie'
import errorManager from  '../controllers/errorManager.js'

function SingIn() {
  const { register, handleSubmit, formState, watch } = useForm()
  const [profileImage, setProfileImage] = useState(`${import.meta.env.VITE_FRONTEND_APP_URL}group.webp`);
  let files = [];
  let err = formState.errors;
  const [formError, setFormError] = useState(false)
  const form = useRef(null)

  const onSubmit = (e)=>{
    const formData = new FormData();
    formData.append('ProfileImage', e.ProfileImage[0])
    formData.append('Description', e.Description)
    formData.append('UserName', e.UserName)
    formData.append('Password', e.Password)
    formData.append('ValidatePasword', e.ValidatePasword)

    fetch(`${import.meta.env.VITE_SERVER_API_URL}SingIn`, {
      method: 'POST',
      body: formData
    })
    .then((res)=>res.json())
    .then((info)=>{
      if(info.ok){
        Cookies.set("JwtToken", info.token)
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
        setProfileImage(e.target.result);
      };
  
      reader.readAsDataURL(watch('ProfileImage')[0]);
    }
  }, [watch('ProfileImage')])

  const DeletePhoto = ()=>{
    form.current.reset();
    setProfileImage(`${import.meta.env.VITE_FRONTEND_APP_URL}group.webp`)
  }

  return (
    <div className='sing-in-page'>
      <h1 className='outstanding-logo'>Text Message System</h1>
      <form className='sing-in-container' ref={form} encType="multipart/form-data" onSubmit={handleSubmit((e)=>onSubmit(e))}>
        <div>
          <h2 className='sing-in-title'>Sing in</h2>
          {formError &&
            <div className='form-err-aclaration sing-in-form-err-aclaration'>
              <p>{formError}</p>
            </div>
          }
          {err.ProfileImage &&
          <div className='form-err-aclaration sing-in-form-err-aclaration'>
              <p>{/* It is mandatory to add a profile photo. */}</p>
            </div>
          }
          <img className='user-image-selector' src={profileImage}/>
          <div className='image-selector-buttons'>
            <input type='button' onClick={()=>DeletePhoto()} className='link' value='Delete photo'/>
            <div className='sing-in-image-selector link'>
              <input type='file' name='ProfileImage' {...register('ProfileImage', { required: false })}/>
            </div>
          </div>
          <p className='image-selector-instructions'>File smaller than 25x25px.</p>
          <div className='sing-in-description-container'>
            <input className={err.Description ? "sing-in-description input-text input-err" : "sing-in-description input-text"} name='Description' type='text' placeholder='Description'  {...register('Description', { maxLength: 100 })}/>
            {err.Description &&
              <div className='input-err-aclaration'>
                <p>This field must contain a maximum of 100 characters.</p>
              </div>
            }
          </div>
        </div>
        <div className='separator'></div>
        <div className='sing-in-account-data'>
          <label>UserName</label>
          <input className={err.UserName ? "input-text input-err" : "input-text"} type='text' name='UserName'  {...register('UserName', { maxLength: 15, minLength: 4, required: true})}/>
          {err.UserName &&
            <div className='input-err-aclaration'>
              <p>This field is required, and must contain between 4 and 15 characters.</p>
            </div>
          }
          <label>Password</label>
          <input className={err.Password ? "input-text input-err" : "input-text"} type='password' name='Password'  {...register('Password', { maxLength: 20, minLength: 5, required: true})}/>
          {err.Password &&
            <div className='input-err-aclaration'>
              <p>This field is required, and must contain between 5 and 20 characters.</p>
            </div>
          }
          <label>Validate pasword</label>
          <input className={err.ValidatePasword ? "input-text input-err" : "input-text"} type='password' name='ValidatePasword'  {...register('ValidatePasword', { maxLength: 20, minLength: 5, required: true})}/>
          {err.ValidatePasword &&
            <div className='input-err-aclaration'>
              <p>This field is required, and must contain between 5 and 20 characters.</p>
            </div>
          }
          <input type='submit' value="Send"/>
          <a className='log-in-link' href='/LogIn'>Log in</a>
        </div>
      </form>
    </div>
  )
}

export default SingIn