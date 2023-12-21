import './LogIn.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Cookies from 'js-cookie'

function logIn() {

  const { register, handleSubmit, formState } = useForm()

  let err = formState.errors;
  const [formError, setFormError] = useState(false)

  const onSubmit = (data)=>{
    fetch(`${import.meta.env.VITE_SERVER_API_URL}logIn`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({UserName:data.UserName, Password:data.Password})
    })
    .then((res)=>res.json())
    .then((info)=>{
      if(info.ok){
        Cookies.set("JwtToken", info.token)
        location.href = import.meta.env.VITE_FRONTEND_APP_URL;
      }else{
        console.error(info)
        switch (info.err) {
          case "invalidInputs":
            setFormError("The format is invalid.")
            break;
          case "invalidCredentials":
            setFormError("The username or password is not correct.")
            break;
          default:
            console.error("Unknown error")
            break;
        }
      }
    })
    .catch((err)=>{console.error(err)})
  }
  
  return (
    <div className='log-in-page'>
      <h1 className='outstanding-logo'>Text Message System</h1>
      <form className='log-in-container' onSubmit={handleSubmit((data)=>onSubmit(data))}>
        <h2 className='log-in-title'>Log in</h2>
        <div className='log-in-account-data'>
          {formError &&
            <div className='form-err-aclaration'>
              <p>{formError}</p>
            </div>
          }
          <label>User name</label>
          <input className={err.UserName ? "input-text input-err" : "input-text"} type='text' {...register('UserName', { maxLength: 15, minLength: 4, required: true})}/>
          {err.UserName &&
            <div className='input-err-aclaration'>
              <p>Este campo es obligatorio, y deve contener entre 4 y 15 caracteres</p>
            </div>
          }
          <label>Password</label>
          <input className={err.Password ? "input-text input-err" : "input-text"} type='text' {...register('Password', { maxLength: 20, minLength: 5, required: true})}/>
          {err.Password &&
            <div className='input-err-aclaration'>
              <p>Este campo es obligatorio, y deve contener entre 5 y 20 caracteres</p>
            </div>
          }
          <input type='submit'/>
          <a className='sing-in-link' href='/SingIn'>Sing in</a>
        </div>
      </form>
    </div>
  )
}

export default logIn