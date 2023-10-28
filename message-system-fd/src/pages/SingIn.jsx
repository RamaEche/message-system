import './SingIn.css'
import {useState} from 'react'

function SingIn() {
  return (
    <div className='sing-in-page'>
      <h1 className='outstanding-logo'>Text Message System</h1>
      <form className='sing-in-container'>
        <h2>Sing In</h2>
        <img className='user-image-selector' src='https://cdn-icons-png.flaticon.com/512/5989/5989226.png'/>
        <div className='image-selector-buttons'>
          <button className='link'>Change photo</button>
          <button className='link'>Delete photo</button>
        </div>
        <input className='sing-in-description input-text' type='text' placeholder='Description'/>
        <div className='separator'></div>
        <div className='account-data'>
          <p>User</p>
          <input className='input-text' type='text'/>
          <p>Password</p>
          <input className='input-text' type='text'/>
          <p>Validate pasword</p>
          <input className='input-text' type='text'/>
          <input type='submit'/>
        </div>
      </form>
      <a href='/LogIn'>Log in</a>
    </div>
  )
}

export default SingIn