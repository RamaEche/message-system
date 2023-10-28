import './Chats.css'
import Chat from '../molecules/Chat'
import {useState} from 'react'

function Chats() {
  const SearchChat = ()=>{
    alert("Searching")
  }

  const OpenOptions = ()=>{
    alert("Options")
  }

  return (
    <div className='chats-box'>
      <div className="bar">
        <div className="logo">
          <h1>Text message System</h1>
        </div>
        <div className='TaskBar'>
          <div className='buttons-pair'>
            <div className='new-group'>
              <a href='/CreateGroup' className='button'>G</a>
            </div>
            <div className='new-contact'>
              <a href='/AddUser' className='button'>C</a>
            </div>
          </div>
          <div className='buttons-pair'>
            <button onClick={()=>SearchChat()} className='button'>S</button>
            <button onClick={()=>OpenOptions()} className='button'>O</button>
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