import './AboutMessage.css'
import {useState, useContext, useEffect} from 'react'
import {BoxesContext, CurrentChatContext, UserIdContext} from "../pages/Home"
import Cookies from 'js-cookie'
import Confirmation from '../molecules/Confirmation'
import AboutMessageUser from '../molecules/AboutMessageUser'

function AboutMessage({ webSocket }) {
  const [boxes, setBoxes] = useContext(BoxesContext)
  const [currentChat] = useContext(CurrentChatContext)
  const [focusedChat, setFocusedChat] = useState(currentChat.chatMessages[currentChat.chatFocusMessage])
  const [token] = useState(Cookies.get('JwtToken'))
  const [userId] = useContext(UserIdContext)
  const [openConfirmation, setOpenConfirmation] = useState(false)

  const MessageBox = ()=>{
    setBoxes({box1:boxes.box1, box2:"MessageBox"})
  }

  useEffect(()=>{
    setFocusedChat(currentChat.chatMessages.slice().reverse()[currentChat.chatFocusMessage])

    webSocket.on("deleteMessage", data=>{
      console.log(data)
    })
  }, [])

  const deleteMessage = ()=>{
    if(focusedChat.id != undefined){
      webSocket.emit("deleteMessage", {
        authorization: `Barrer ${token}`,
        chatId:currentChat.chatId,
        messageId:focusedChat.id
      })
    }else{
      console.log("The message is not on the server so it cannot be deleted.")
    }
    setOpenConfirmation(false)
    MessageBox()
  }



  return (
    <div className='about-message-container'>
      <div className='about-message-bar'>
        <a className='about-message-go-back-arrow' onClick={()=>MessageBox()}><img src='arrow.png'/></a>
        <h1 className='about-message-outstanding-logo'>Text Message System</h1>
      </div>
      <div className='about-message-bar-bg'>
        <div className='about-message-bar-people-container'>
          {focusedChat.id != undefined ?
            focusedChat.seenBy.map((id, index)=>(
              <AboutMessageUser key={index} id={id} focusedChat={focusedChat}/>
            ))
          :
          <AboutMessageUser id={userId} focusedChat={focusedChat}/>}
        </div>
        <button onClick={()=>setOpenConfirmation(true)} className='about-message-bar-delete-message'>Delete message</button>
        {openConfirmation &&
          <Confirmation cbFalse={()=>setOpenConfirmation(false)} cbTrue={()=>deleteMessage()} text="Are you sure you want to delete the message?"/>
        }
      </div>
    </div>
  )
}

export default AboutMessage