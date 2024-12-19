import './Chats.css'
import Chat from '../molecules/Chat'
import {useContext, useEffect, useState, useRef} from 'react'
import {BoxesContext, UserIdContext} from '../pages/Home'
import Cookies from 'js-cookie'
import Loading from "../atoms/Loading.jsx"
import NoMoreUsers from "../atoms/NoMoreUsers.jsx"

function Chats({ socket, oneBoxeMode, chatsStatus, setSearchType, chats, setChats, chatsImage, setChatsImage}) {
  const [token] = useState(Cookies.get('JwtToken'))
  const [boxes, setBoxes] = useContext(BoxesContext)
  const [, setUserId] = useContext(UserIdContext)
  const [clicked, setClicked] = useState("")
  const clickedRef = useRef(clicked);
  const oneBoxeModeRef = useRef(oneBoxeMode);
  const boxesRef = useRef(boxes);

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

    //socket.emit('authenticateUser', {authorization:`Barrer ${token}`})
    socket.emit('getUserChats', {authorization:`Barrer ${token}`})
    socket.on('authenticateUser', data=>{
      if(data.status == 401){
        location.href = `${import.meta.env.VITE_FRONTEND_APP_URL}login`
      }else if(data.status == 200){
        setUserId(data.userId)
      }else{
        console.error(data)
      }
      socket.emit('getUserChats', {authorization:`Barrer ${token}`})
    })

    socket.on('getUserChats', data=>{
        if(data.status == 401){
        location.href = `${import.meta.env.VITE_FRONTEND_APP_URL}login`
      }else if(data.status == 200){
        setChats(data.chats)
      }else{
        console.error(data)
      }
    })

    socket.on('fromServerNewMessage', data => {
      if((clickedRef.current == data.chatId && oneBoxeModeRef.current == true && boxesRef.current.currentBox == 2) || (clickedRef.current == data.chatId && oneBoxeModeRef.current == false && boxesRef.current.box2 != "Welcome")){
        return 0
      }

      setChats(currentChats =>{
        const modificatedChatIndex = currentChats.findIndex(chat => chat.id==data.chatId)
        if(modificatedChatIndex == -1){
          location.href = import.meta.env.VITE_FRONTEND_APP_URL;
        }
        const modificatedChat = currentChats[modificatedChatIndex]
        let newChat = {
          id: modificatedChat.id,
          Name:modificatedChat.Name,
          Type:modificatedChat.Type,
          Description:data.TextMessage,
          UserCurrentState:modificatedChat.UserCurrentState,
          IgnoredMessageCounter:modificatedChat.IgnoredMessageCounter+1,
        };
        currentChats[modificatedChatIndex] = newChat
        return [...currentChats];
      })
    });
  }, []);

  useEffect(() => {
    clickedRef.current = clicked;
  }, [clicked]);

  useEffect(() => {
    oneBoxeModeRef.current = oneBoxeMode;
  }, [oneBoxeMode]);

  useEffect(() => {
    boxesRef.current = boxes;
  }, [boxes]);

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
            return <Chat key={i} setClicked={setClicked} chatsImage={chatsImage} setChatsImage={setChatsImage} chatsStatus={chatsStatus} ChatID={chat.id} Type={chat.Type} Name={chat.Name} Description={chat.Description} IgnoredMessageCounter={chat.IgnoredMessageCounter}/>
          })
        )}
      </div>
    </div>
  )
}

export default Chats