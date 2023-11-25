import './LogIn.css'
import {useState} from 'react'

function logIn() {
  return (
    <div className='log-in-page'>
      <h1 className='outstanding-logo'>Text Message System</h1>
      <form className='log-in-container'>
      <h2 className='log-in-title'>Log in</h2>
        <div className='log-in-account-data'>
          <p>User</p>
          <input className='input-text' type='text'/>
          <p>Password</p>
          <input className='input-text' type='text'/>
          <input type='submit'/>
          <a className='sing-in-link' href='/SingIn'>Sing in</a>
        </div>
      </form>
    </div>
  )
}

export default logIn