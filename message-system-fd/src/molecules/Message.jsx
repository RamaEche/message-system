import './Message.css';
import React, { useContext } from 'react';
import { BoxesContext, CurrentChatContext } from '../pages/Home'

function Message({ index, text, time, name=null, internalOrigin }){
    const [boxes, setBoxes] = useContext(BoxesContext)
    const [currentChat, setCurrentChat] = useContext(CurrentChatContext)
    const messageStatePanel = ()=>{
        setBoxes({box1:boxes.box1, box2:"aboutMessage"})
        setCurrentChat(currentChatData =>{
            currentChatData.chatFocusMessage = index
            return currentChatData
        })
    }

    return(
        <div className={internalOrigin ? 'message-container' : 'message-container external-origin'} onClick={()=>{messageStatePanel()}}>
            {name != null && <p className='message-container-name-container'>{name}</p>}
            <div className='message-container-text-container'>
                <span>{time}</span>
                <p>{text}</p>
            </div>
            <div></div>
        </div>
    )
}

export default Message