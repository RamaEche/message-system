import './Chats.css'
import Chat from '../molecules/Chat'
import {useState} from 'react'

function Chats() {
  return (
    <div className='chats-box'>
      <div className="bar">
        <div className="logo">
          <h1>Text message System</h1>
        </div>
        <div className='TaskBar'>
          <div className='buttons-pair'>
            <div className='new-group'>
              <p className='button'>G</p>
            </div>
            <div className='new-contact'>
              <p className='button'>C</p>
            </div>
          </div>
          <div className='buttons-pair'>
            <p className='button'>S</p>
            <p className='button'>O</p>
          </div>
        </div>
      </div>
      <div className="chats">
        <Chat/>
        <Chat/>
      </div>
    </div>
  )
}

export default Chats