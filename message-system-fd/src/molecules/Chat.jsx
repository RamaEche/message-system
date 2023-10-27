import './Chat.css'
import {useState} from 'react'

function Chat() {
  return (
    <div className='chat-box'>
        <div className='chat-content'>
            <div className='chat-data'>
                <div className="image"></div>
                <div className='chat-text'>
                    <p className="name">Matias</p>
                    <p className="last-message">Hola, como estas...</p>
                </div>
            </div>
            <div className='notifications'>
                <div className='green-circle-notification'>2</div>
                <div className='gray-circle-notification'></div>
            </div>
        </div>
    </div>
  )
}

export default Chat