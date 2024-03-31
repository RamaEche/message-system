import './RestorePassword.css'
import {useState} from 'react'
import { useForm } from 'react-hook-form'
import Cookies from 'js-cookie'
import errorManager from  '../controllers/errorManager.js'

function RestorePassword() {

  const { register, handleSubmit, formState } = useForm()

  let err = formState.errors;

  const [formError, setFormError] = useState(false)

  const onSubmit = (data)=>{
    console.log(JSON.stringify({UserName:data.UserName, Password:data.Password, LastPassword:data.LastPassword}))
    fetch(`${import.meta.env.VITE_SERVER_API_URL}RestorePassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({UserName:data.UserName, NewPassword:data.NewPassword, LastPassword:data.LastPassword})
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
    .catch((err)=>console.log(err))
  }
  
  return (
    <div className='restore-password-page'>
      <h1 className='outstanding-logo'>Text Message System</h1>
      <a href={import.meta.env.VITE_FRONTEND_APP_URL}><img className='restore-password-go-back-arrow' src='arrow.png'/></a>
      <form className='restore-password-container' onSubmit={handleSubmit((data)=>onSubmit(data))}>
        <h2 className='restore-password-title'>Restore password</h2>
        {formError &&
        <div className='form-err-aclaration'>
            <p>{formError}</p>
          </div>
        }
        <div className='restore-password-account-data'>
          <p>Username</p>
          <input className={err.UserName ? " input-text input-err" : "input-text"} type='text' {...register('UserName', { maxLength: 15, minLength: 4, required: true})}/>
          {err.UserName &&
            <div className='input-err-aclaration'>
              <p>Este campo es obligatorio, y deve contener entre 4 y 15 caracteres</p>
            </div>
          }
          <p>Last password</p>
          <input className={err.LastPassword ? " input-text input-err" : " input-text"} type='text' {...register('LastPassword', { maxLength: 20, minLength: 4, required: true})}/>
          {err.LastPassword &&
            <div className='input-err-aclaration'>
              <p>Este campo es obligatorio, y deve contener entre 4 y 20 caracteres</p>
            </div>
          }
          <p>New password</p>
          <input className={err.NewPassword ? " input-text input-err" : " input-text"} type='text' {...register('NewPassword', { maxLength: 20, minLength: 5, required: true})}/>
          {err.NewPassword &&
            <div className='input-err-aclaration'>
              <p>Este campo es obligatorio, y deve contener entre 4 y 20 caracteres</p>
            </div>
          }
          <input type='submit'/>
        </div>
      </form>
    </div>
  )
}

export default RestorePassword