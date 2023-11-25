import './RestorePassword.css'
import {useState} from 'react'

function RestorePassword() {
  return (
    <div className='restore-password-page'>
      <h1 className='outstanding-logo'>Text Message System</h1>
      <a href=''><img className='restore-password-go-back-arrow' src='arrow.png'/></a>
      <form className='restore-password-container'>
        <h2 className='restore-password-title'>Restore password</h2>
        <div className='restore-password-account-data'>
          <p>User</p>
          <input className='input-text' type='text'/>
          <p>New password</p>
          <input className='input-text' type='text'/>
          <p>Last pasword</p>
          <input className='input-text' type='text'/>
          <input type='submit'/>
        </div>
      </form>
    </div>
  )
}

export default RestorePassword