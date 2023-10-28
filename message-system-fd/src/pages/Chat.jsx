import Chats from '../organisms/Chats'
import ChatPanel from '../organisms/ChatPanel'
import {useState} from 'react'

function Chat() {
  return (
    <div className='app-margin'>
      <div className='app-container'>
        <div className='chat-container'><Chats/></div>
        <div className='messages-container'><ChatPanel/></div>
      </div>
    </div>
  )
}

export default Chat