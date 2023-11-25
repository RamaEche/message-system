import './ChatOption.css'
import {useState, useContext} from 'react'
import {BoxesContext} from "../pages/Home"

function ChatOption() {

  const [boxes, setBoxes] = useContext(BoxesContext)

  const MessageBox = ()=>{
    setBoxes({box1:boxes.box1, box2:"MessageBox"})
  }

  return (
    <div className='chat-option-container'>
      <div className='chat-option-bar'>
        <a className='chat-option-go-back-arrow' onClick={()=>MessageBox()}><img src='arrow.png'/></a>
        <h1 className='chat-option-outstanding-logo'>Text Message System</h1>
      </div>
      <form className='chat-options-form-container'>
        <div className='chat-options-profile'>
          <img className='chat-options-profile-photo' src='https://cdn-icons-png.flaticon.com/512/5989/5989226.png'/>
          <div className='chat-options-profile-data'>
            <h3>@mati2000</h3>
            <p >Me llamo Matias, tengo 23 y me gusta el Jaz 😃</p>
            <p className='user-storage'>724MB/5G</p>
          </div>
        </div>
        <div className='chat-options-container'>
            <p>Name</p>
            <input className='input-text' type='text'/>
            <div className='chat-options-form-changes-buttons'>
              <input type='reset'/>
              <input className='main-button' type='submit'/>
            </div>
            <a className='chat-options-link' href='/LogIn'>Empty conversation</a>
            <a className='chat-options-link' href='/LogIn'>block user</a>
        </div>
      </form>
    </div>
  )
}

export default ChatOption