import './Chat.css'
import {useState, useContext} from 'react'
import {BoxesContext} from '../pages/Home'

function Chat() {

  const [boxes, setBoxes] = useContext(BoxesContext)

  const OpenChat = ()=>{
    setBoxes({box1:boxes.box1, box2:"MessageBox"})
  }

  return (
    <a onClick={()=>OpenChat()} className='chat-box'>
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
    </a>
  )
}

export default Chat