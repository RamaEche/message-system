import './MessageBox.css'
import Cookies from "js-cookie";
import {useState, useContext, useEffect, useRef} from 'react'
import {BoxesContext, UserIdContext, CurrentChatContext} from "../pages/Home"
import Message from '../molecules/Message'
import FileSelectorOption from "../atoms/FileSelectorOption"
import { useForm } from 'react-hook-form'

function MessageBox({ webSocket }) {
  const [messageInputFileButton, setMessageInputFileButton] = useState('close')
  const [boxes, setBoxes] = useContext(BoxesContext)
  const [currentChat, setCurrentChat] = useContext(CurrentChatContext)
  const [messages, setMessages] = useState([])
  const [globalChatData, setGlobalChatData] = useState(null)
  const [token] = useState(Cookies.get('JwtToken'))
  const [userId] = useContext(UserIdContext)

  const { register, handleSubmit, formState, reset } = useForm()

  const ChatOption = ()=>{
    setBoxes({box1:boxes.box1, box2:"ChatOption"})
  }

  const sendMessage = (data)=>{
    if(data.text.replaceAll(' ', '') == '') {
      reset();
      return 0
    }

    let name = currentChat.chatData.users.filter(usr => userId == usr.userId)[0].name
    createMessage(
      undefined,
      currentChat.chatData.type,
      data.text,
      new Date(),
      name,
      true,
      "",
      "",
      "none", //falta
      "sending"
    )

    webSocket.emit("postNewMessage", {
      authorization: `Barrer ${token}`,
      chatId:currentChat.chatId,
      text:data.text
    });
    reset();
  }

  const createMessage = (id, chatType, text, postedTime, name, internalOrigin, sentBy, seenBy, fileState="none", messageState="sending")=>{
    //messageState = sending, onServer, seen and mixed
    //fileState = none, sending, onServer, seen and mixed
    setMessages(msgs =>{
      const newMsgs = [...msgs, {id, chatType, text, time:postedTime.getHours()+':'+postedTime.getMinutes(), name, internalOrigin, sentBy, seenBy, fileState, messageState}]
      setCurrentChat(currentChatData =>{
        currentChatData.chatMessages = newMsgs
        return currentChatData
      })
      return newMsgs
    })
  }

  useEffect(()=>{
    if(currentChat) {
      setCurrentChat(currentChatData =>{
        currentChatData.chatMessages = messages
        return currentChatData
      })
    }
  }, [messages])

  useEffect(()=>{
    if(currentChat){
      setMessages([])
  
      webSocket.emit('getMessagesChunk', {authorization: `Barrer ${token}`, chatId:currentChat.chatId, chunk:0})
    }

  }, [currentChat])

  useEffect(()=>{
    let chatData;
    webSocket.on('getMessagesChunk', data=>{
      chatData = data.chatData;
      setCurrentChat(currentChatData =>{
        currentChatData.chatData = chatData;
        return currentChatData
      })
      for (let i = 0; i < data.messages.length; i++) {
        let date = new Date(data.messages[i].PublicationTime)
        let name = data.chatData.users.filter(usr => data.messages[i].SentById == usr.userId)[0].name
        let messageState = "seen"
        if (chatData.type == 'G') messageState = "mixed"
        createMessage(
          data.messages[i].id,
          chatData.type,
          data.messages[i].TextMessage,
          date,
          name,
          data.messages[i].internalOrigin,
          data.messages[i].SentById,
          data.messages[i].SeenById,
          "none", //falta
          messageState
          )
      }
      webSocket.emit('postChatRead', {authorization: `Barrer ${token}`, chatId:currentChat.chatId})
    })

    webSocket.on('postNewMessage', data=>{
      if(data.status != 201){
        //actualizar mensaje ya creado
      }else{
        //actualizar mensaje ya creado
      }
    })

    webSocket.on('fromServerNewMessage', data => {
      if(data.chatId==currentChat.chatId){
        let date = new Date(data.PublicationTime)
        let name = chatData.users.filter(usr => data.SentById == usr.userId)[0].name
        let messageState = "seen"
        if (chatData.type == 'G') messageState = "mixed"
        createMessage(
          data.id,
          chatData.type,
          data.TextMessage,
          date,
          name,
          data.internalOrigin,
          data.SentById,
          data.SeenById,
          "none", //falta
          messageState
        )
        webSocket.emit('postChatRead', {authorization: `Barrer ${token}`, chatId:currentChat.chatId})
      }
    });
  }, [])

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
      <div className='message-box-messages'>
        <div className='message-box-messages-container'>
          {messages.slice().reverse().map(({text, time, name, internalOrigin}, index)=>(
            <Message key={index} index={index} text={text} time={time} name={name} internalOrigin={internalOrigin}/>
          ))}
        </div>
      </div>
      <form className='message-box-input' onSubmit={handleSubmit((data)=>sendMessage(data))}>
        <input type='text' className='message-box-input-text' placeholder='Send mensage...' {...register('text', {required: true})}/>
        <input type='button' onClick={()=>{if(messageInputFileButton == "open"){setMessageInputFileButton("closed")}else{setMessageInputFileButton("open")}}} className='message-input-file'/>
        <input type="submit" className='message-input-send'/>
        {/* <img src="./sendArrow.png"/> */}
      </form>
      {messageInputFileButton == "open" &&(
        <div className='message-box-input-file'>
            <FileSelectorOption cb={UploadImage()}/>
          <div className='message-box-input-file-detail'></div>
        </div>
      )}
    </div>
  )
}

export default MessageBox