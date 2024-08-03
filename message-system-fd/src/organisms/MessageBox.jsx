import './MessageBox.css'
import Cookies from "js-cookie";
import React, {useState, useContext, useEffect, lazy, Suspense, useRef} from 'react'
import {BoxesContext, UserIdContext, CurrentChatContext} from "../pages/Home"
import Message from '../molecules/Message'
import { useForm } from 'react-hook-form'
import FileSelectorOption from '../atoms/FileSelectorOption'

  function MessageBox({ webSocket, chatsImage, chatsStatus }) {
  const [messageInputFileButton, setMessageInputFileButton] = useState('close')
  const [boxes, setBoxes] = useContext(BoxesContext)
  const [currentChat, setCurrentChat] = useContext(CurrentChatContext)
  const [messages, setMessages] = useState([])
  const [token] = useState(Cookies.get('JwtToken'))
  const [userId] = useContext(UserIdContext)
  const goBackArrow = useRef(null)
  const [userData, setUserData] = useState({ name:"Chat", state:false, src:`${import.meta.env.VITE_FRONTEND_APP_URL}group.png` })
  const textA = useRef(null)
  const lastDate = useRef(false)

  const LazyLoadedComponent = lazy(() => import('emoji-picker-react')); // The import: import EmojiPicker from 'emoji-picker-react';

  const { handleSubmit, reset } = useForm()

  const Chats = ()=>{
    setBoxes({box1:"Chats", box2:boxes.box2, currentBox:1})
  }

  const handleResize = () => {
    if(window.innerWidth <= 850){
      goBackArrow.current.classList.remove("none")
    }else{
      goBackArrow.current.classList.add("none")
    }
  }

  useEffect(()=>{
    window.addEventListener("resize", handleResize, false);
    handleResize()
  }, [])

  const ChatOption = ()=>{
    if(currentChat.chatType == "U"){
      setBoxes({box1:boxes.box1, box2:"ChatOption"})
    }else{
      setBoxes({box1:boxes.box1, box2:"GroupOption"})
    }
  }

  const sendMessage = ()=>{
    if(textA.current.value.replaceAll(' ', '') == '') {
      reset();
      return 0
    }

    let name = currentChat.chatData.users.filter(usr => userId == usr.userId)[0].name
    createMessage(
      undefined,
      currentChat.chatData.type,
      textA.current.value,
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
      text:textA.current.value
    });
    textA.current.value = "";
    reset();
  }

  const createMessage = (id, chatType, text, postedTime, name, internalOrigin, sentBy, seenBy, fileState="none", messageState="sending")=>{
    //messageState = sending, onServer, seen and mixed
    //fileState = none, sending, onServer, seen and mixed
    
    let hours = postedTime.getHours()
    hours = hours < 10 ? "0"+hours : hours
    let minutes = postedTime.getMinutes()
    minutes = minutes < 10 ? "0"+minutes : minutes

    const msgDay = postedTime.getDate()
    const msgMonth = postedTime.getMonth()+1
    const msgFullYear = postedTime.getFullYear()

    let date = false
    if(lastDate.current != `${msgMonth}/${msgDay}/${msgFullYear}`){
      lastDate.current = `${msgMonth}/${msgDay}/${msgFullYear}`
      date = `${msgMonth}/${msgDay}/${msgFullYear}`
    }

    setMessages(msgs =>{
      const newMsgs = [...msgs, {id, chatType, text, time:hours+':'+minutes, name, internalOrigin, sentBy, seenBy, fileState, messageState, date}]
      setCurrentChat(currentChatData =>{
        currentChatData.chatMessages = newMsgs
        return currentChatData
      })
      return newMsgs
    })
  }

  const chargeState = ()=>{
    const chatsStatusIndex = chatsStatus.findIndex(i=>i.chatId == currentChat.chatId)
    if(chatsStatusIndex != -1){
      setUserData(CUserData=>({
        ...CUserData,
        state:chatsStatus[chatsStatusIndex].state
      }))
    }else{
      setUserData(CUserData=>({
        ...CUserData,
        state:false
      }))
    }
  }

  useEffect(()=>{
    if(messages.length > 0){
      setCurrentChat(currentChatData =>{
        currentChatData.chatMessages = messages
        return currentChatData
      })
    }
  }, [messages])

  useEffect(()=>{
    setMessages([])
    lastDate.current = false
    webSocket.emit('getMessagesChunk', {authorization: `Barrer ${token}`, chatId:currentChat.chatId, chunk:0})
    webSocket.emit('getChatDescriptionData', {authorization: `Barrer ${token}`, chatId:currentChat.chatId, chatType:currentChat.chatType})
    chargeState()
  }, [currentChat])

  useEffect(()=>{
    chargeState()
  }, [chatsStatus])

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

    webSocket.on('getChatDescriptionData', data=>{
      const chatsImageIndex = chatsImage.findIndex(i=>i.chatID == data.chatId)
      if(chatsImageIndex != -1){
        setUserData(CUserData=>({
          ...CUserData,
          src:chatsImage[chatsImageIndex].src,
          name: data.name
        }))
      }else{
        setUserData(CUserData=>({
          ...CUserData,
          src:`${import.meta.env.VITE_FRONTEND_APP_URL}group.png`,
          name: data.name
        }))
      }
    })
  }, [])

  const addEmoji = (emojiData)=>{
    textA.current.value = textA.current.value+String.fromCodePoint(parseInt(emojiData.unified, 16))
  }

  return (
    <div className='message-box'>
      <div className="message-box-bar-container">
        <div ref={goBackArrow} className='message-box-go-back-arrow-container' onClick={()=>Chats()}><a className='message-box-go-back-arrow'><img src='arrow.png'/></a></div> {/* This fragment is a modification of the GoBackArrow component */}
        <div className="message-box-bar" onClick={()=>ChatOption()}>
          <div className='message-box-profile-data'>
            <div className='message-box-profile-photo'>
              <img src={userData.src}/>
            </div>
            <div>
                <h3>{userData.name}</h3>
                <div>{userData.state == true && "Online"}</div>
            </div>
          </div>
          <img src='options.png' className='message-box-profile-options'/>
        </div>
      </div>
      <div className='message-box-messages'>
        <div className='message-box-messages-container'>
          {messages.slice().reverse().map(({text, time, date, name, internalOrigin}, index)=>(
            <React.Fragment key={index}>
              <Message index={index} text={text} time={time} name={name} internalOrigin={internalOrigin}/>
              {date && (
                date == `${new Date().getMonth()+1}/${new Date().getDate()}/${new Date().getFullYear()}` ?
                <div className='message-box-date-pointer'><p>Today</p></div> :
                <div className='message-box-date-pointer'><p>{date}</p></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <form className='message-box-input' onSubmit={handleSubmit((data)=>sendMessage(data.text))}>
        <div className="message-box-input-text-container"><textarea className="message-box-input-text" ref={textA} placeholder='Send mensage...'></textarea></div>
        <FileSelectorOption className='message-input-file' messageInputFileButton={messageInputFileButton} setMessageInputFileButton={setMessageInputFileButton} onClick={()=>{setMessageInputFileButton("open")}}></FileSelectorOption>
        <div className='message-input-send-container'>
          <input type="submit" className='message-input-send' value=""/>
        </div>
      </form>
      {messageInputFileButton == "open" &&(
        <div className='message-box-input-file'>
              <div>
                <Suspense fallback={<><br/><br/>Loading...</>}>
                  <LazyLoadedComponent onEmojiClick={(Emoji)=>addEmoji(Emoji)} emojiStyle={"google"} skinTonesDisabled={true} lazyLoadEmojis={true}/>
                </Suspense>
              </div>
          <div className='message-box-input-file-detail'></div>
        </div>
      )}
    </div>
  )
}

export default MessageBox