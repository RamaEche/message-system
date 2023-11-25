import './UserOptions.css'
import {useState, useContext} from 'react'
import {BoxesContext} from "../pages/Home"

function UserOptions() {

  const [boxes, setBoxes] = useContext(BoxesContext)

  const Chats = ()=>{
    setBoxes({box1:"Chats", box2:boxes.box2})
  }

  return (
    <div className='user-option-container'>
      <div className='user-option-bar'>
        <a className='user-option-go-back-arrow' onClick={()=>Chats()}><img src='arrow.png'/></a>
        <h1 className='user-option-outstanding-logo'>Text Message System</h1>
      </div>
      <form className='user-options-form-container'>
        <div className='user-options-profile-photo'>
          <img className='user-image-selector' src='https://cdn-icons-png.flaticon.com/512/5989/5989226.png'/>
          <div className='image-selector-buttons'>
            <button className='link'>Change photo</button>
            <button className='link'>Delete photo</button>
          </div>
          <p className='user-storage'>724MB/5G</p>
        </div>
        <div className='user-options-container'>
            <p>User</p>
            <input className='input-text' type='text'/>
            <p>Password</p>
            <input className='input-text' type='text'/>
            <div className='user-options-form-changes-buttons'>
              <input type='reset'/>
              <input type='submit'/>
            </div>
            <a className='user-options-link' href='/LogIn'>Restore account</a>
            <a className='user-options-link' href='/LogIn'>Close account</a>
            <a className='user-options-link' href='/LogIn'>Remove account</a>
        </div>
      </form>
    </div>
  )
}

export default UserOptions