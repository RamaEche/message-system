import './MessageBox.css'
import Cookies from "js-cookie";
import {useState, useContext, useEffect, lazy, Suspense} from 'react'
import {BoxesContext, UserIdContext, CurrentChatContext} from "../pages/Home"
import Message from '../molecules/Message'
import { useForm } from 'react-hook-form'
import FileSelectorOption from '../atoms/FileSelectorOption'

  function MessageBox({ webSocket }) {
  const [messageInputFileButton, setMessageInputFileButton] = useState('close')
  const [boxes, setBoxes] = useContext(BoxesContext)
  const [currentChat, setCurrentChat] = useContext(CurrentChatContext)
  const [messages, setMessages] = useState([])
  const [token] = useState(Cookies.get('JwtToken'))
  const [userId] = useContext(UserIdContext)

  const LazyLoadedComponent = lazy(() => import('emoji-picker-react')); // The import: import EmojiPicker from 'emoji-picker-react';

  const { register, handleSubmit, reset, setValue, watch } = useForm()

  const Chats = ()=>{
    setBoxes({box1:"Chats", box2:boxes.box2, currentBox:1})
  }

  const ChatOption = ()=>{
    if(currentChat.chatType == "U"){
      setBoxes({box1:boxes.box1, box2:"ChatOption"})
    }else{
      setBoxes({box1:boxes.box1, box2:"GroupOption"})
    }
  }

  const sendMessage = (data)=>{
    if(data.replaceAll(' ', '') == '') {
      reset();
      return 0
    }

    let name = currentChat.chatData.users.filter(usr => userId == usr.userId)[0].name
    createMessage(
      undefined,
      currentChat.chatData.type,
      data,
      new Date(),
      name,
      true,
      "",
      "",
      "none", //Fail.
      "sending"
    )

    webSocket.emit("postNewMessage", {
      authorization: `Barrer ${token}`,
      chatId:currentChat.chatId,
      text:data
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
          "none", //Fail.
          messageState
          )
      }
      webSocket.emit('postChatRead', {authorization: `Barrer ${token}`, chatId:currentChat.chatId})
    })

    webSocket.on('postNewMessage', data=>{
      if(data.status != 201){
        //Update already created message.
      }else{
        //Update already created message.
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
          "none", //Fail.
          messageState
        )
        webSocket.emit('postChatRead', {authorization: `Barrer ${token}`, chatId:currentChat.chatId})
      }
    });
  }, [])

  const prueba = (emojiData)=>{
    setValue('text', watch("text")+String.fromCodePoint(parseInt(emojiData.unified, 16)), { shouldValidate: true })
  }

  const manejarKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage(event.target.value);
    }
  };

  return (
    <div className='message-box'>
      <div className="message-box-bar-container">
        <div className='message-box-go-back-arrow' onClick={()=>Chats()}><a className='go-back-arrow'><img src='arrow.png'/></a></div>
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
      </div>
      <div className='message-box-messages'>
        <div className='message-box-messages-container'>
          {messages.slice().reverse().map(({text, time, name, internalOrigin}, index)=>(
            <Message key={index} index={index} text={text} time={time} name={name} internalOrigin={internalOrigin}/>
          ))}
        </div>
      </div>
      <form className='message-box-input' onSubmit={handleSubmit((data)=>sendMessage(data.text))}>
        <input type='text' className='message-box-input-text' placeholder='Send mensage...' onKeyDown={manejarKeyPress} {...register('text', {required: true})}/>
        <FileSelectorOption className='message-input-file' messageInputFileButton={messageInputFileButton} setMessageInputFileButton={setMessageInputFileButton} onClick={()=>{setMessageInputFileButton("open")}}></FileSelectorOption>
        <div className='message-input-send-container'>
          <input type="submit" className='message-input-send' value=""/>
        </div>
      </form>
      {messageInputFileButton == "open" &&(
        <div className='message-box-input-file'>
              <div>
                <Suspense fallback={<><br/><br/>Loading...</>}>
                  <LazyLoadedComponent onEmojiClick={(Emoji)=>prueba(Emoji)} emojiStyle={"google"} skinTonesDisabled={true} lazyLoadEmojis={true}/>
                </Suspense>
              </div>
          <div className='message-box-input-file-detail'></div>
        </div>
      )}
    </div>
  )
}

export default MessageBox