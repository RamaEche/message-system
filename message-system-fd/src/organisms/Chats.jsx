import './Chats.css'
import Chat from '../molecules/Chat'
import {useContext, useEffect, useState} from 'react'
import {BoxesContext, UserIdContext, CurrentChatContext} from '../pages/Home'
import Cookies from 'js-cookie'
import socketIOClient from 'socket.io-client';
import Loading from "../atoms/Loading.jsx"
import NoMoreUsers from "../atoms/NoMoreUsers.jsx"

function Chats({ webSocket, setWebSocket, setSearchType, chats, setChats}) {
  const [token] = useState(Cookies.get('JwtToken'))
  const [boxes, setBoxes] = useContext(BoxesContext)
  const [currentChat] = useContext(CurrentChatContext)
  const [, setUserId] = useContext(UserIdContext)

  const socket = socketIOClient('http://localhost:3000');

  const SearchChat = ()=>{
    setSearchType("knownUsers")
    setBoxes({box1:'SearchUser', box2:boxes.box2, currentBox:1});
  }

  const UserOptions = ()=>{
    setBoxes({box1:'UserOptions', box2:boxes.box2, currentBox:1});
  }

  const CreateGroup = ()=>{
    setBoxes({box1:'CreateGroup', box2:boxes.box2, currentBox:1});
  }

  const AddUser = ()=>{
    setSearchType("unknownUsers")
    setBoxes({box1:'SearchUser', box2:boxes.box2, currentBox:1}); //The user is searched and then added.
  }

  useEffect(()=>{
    setWebSocket(socket)

    //socket.emit('authenticateUser', {authorization:`Barrer ${token}`})
    socket.emit('getUserChats', {authorization:`Barrer ${token}`})
    socket.on('authenticateUser', data=>{
      if(data.status == 401){
        location.href = `${import.meta.env.VITE_FRONTEND_APP_URL}login`
      }else if(data.status == 200){
        setUserId(data.userId)
      }else{
        console.log(data)
      }
      socket.emit('getUserChats', {authorization:`Barrer ${token}`})
    })

    socket.on('getUserChats', data=>{
        if(data.status == 401){
        location.href = `${import.meta.env.VITE_FRONTEND_APP_URL}login`
      }else if(data.status == 200){
        setChats(data.chats)
      }else{
        console.log(data)
      }
    })

    socket.on('fromServerNewMessage', data => {
      if(data.chatId==currentChat.chatId){
        return 0
      }

      setChats(prevChats =>{
        let currentChats = prevChats;
        let modificatedChat = currentChats.filter(chat => chat.id==data.chatId)
        modificatedChat = modificatedChat[0]
        let newChat = {
          id: modificatedChat.id,
          Name:modificatedChat.Name,
          Type:modificatedChat.Type,
          Description:data.TextMessage,
          UserCurrentState:modificatedChat.UserCurrentState,
          IgnoredMessageCounter:modificatedChat.IgnoredMessageCounter+1,
        };
        currentChats = currentChats.filter(chat => chat.id!=data.chatId)
        currentChats.push(newChat)

        return currentChats;
      })
    });
  }, []);

  return (
    <div className='chats-box'>
      <div className="bar">
        <div className="logo">
          <h1>Text Message System</h1>
        </div>
        <div className='TaskBar'>
          <div className='buttons-pair'>
            <button onClick={()=>CreateGroup()} className='chats-button'><img className='chats-icon' src={`${import.meta.env.VITE_FRONTEND_APP_URL}addGroup.svg`}/></button>
            <button onClick={()=>AddUser()} className='chats-button'><img className='chats-icon' src={`${import.meta.env.VITE_FRONTEND_APP_URL}addUser.svg`}/></button>
          </div>
          <div className='buttons-pair'>
            <button onClick={()=>SearchChat()} className='chats-button'><img className='chats-icon' src={`${import.meta.env.VITE_FRONTEND_APP_URL}search.svg`}/></button>
            <button onClick={()=>UserOptions()} className='chats-button'><img className='chats-icon' src={`${import.meta.env.VITE_FRONTEND_APP_URL}settings.svg`}/></button>
          </div>
        </div>
      </div>
      <div className="chats">
        {chats == null ?
        (
          <div className='chats-loading'>
            <Loading/>
          </div>
        ): chats == 0 ?
        (
          <NoMoreUsers/>
        ):
        (
          chats.map((chat, i)=>{
            return <Chat socket={webSocket} key={i} ChatID={chat.id} Type={chat.Type} Name={chat.Name} Description={chat.Description} IgnoredMessageCounter={chat.IgnoredMessageCounter}/>
          })
        )}
      </div>
    </div>
  )
}

export default Chats