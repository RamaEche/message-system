import './MessageBox.css'
import {useState, useContext} from 'react'
import {BoxesContext} from "../pages/Home"

function MessageBox() {

  const [boxes, setBoxes] = useContext(BoxesContext)

  const ChatOption = ()=>{
    setBoxes({box1:boxes.box1, box2:"ChatOption"})
  }

  return (
    <div className='message-box'>
      <div className="message-box-bar" onClick={()=>ChatOption()}>
        <div className='message-box-profile-data'>
          <div className='message-box-profile-photo'></div>
          <div>
              <h3>Matias</h3>
              <div>Online</div>
          </div>
        </div>
        <img src='options.png' className='message-box-profile-options'/>
      </div>
      <div className='message-box-messages'></div>
      <div className='message-box-input'>
        <input type='text' className='message-box-input-text' placeholder='Send mensage...'/>
        <div className='hidden message-box-input-file'></div>
        <div className='message-box-input-send'></div>
      </div>
    </div>
  )
}

export default MessageBox