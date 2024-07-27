import Chats from '../organisms/Chats'
import UserOptions from '../organisms/UserOptions'
import SearchUser from '../organisms/SearchUser'
import AddUser from '../organisms/AddUser'
import CreateGroup from '../organisms/CreateGroup'

import Welcome from '../organisms/Welcome'
import MessageBox from '../organisms/MessageBox'
import ChatOption from '../organisms/ChatOption'
import GroupOption from '../organisms/GroupOption'
import AboutMessage from '../organisms/AboutMessage'

import './Home.css'
import {useState, createContext, useEffect, useRef} from 'react'
import socketIOClient from 'socket.io-client';

const BoxesContext = createContext()
const UserIdContext = createContext()
const CurrentChatContext = createContext()
export { BoxesContext, UserIdContext, CurrentChatContext }

function Home() {
  const [boxes, setBoxes] = useState({box1:'Chats', box2:'Welcome', currentBox:1})
  const [oneBoxeMode, setOneBoxeMode] = useState(null)
  const [webSocket, setWebSocket] = useState(null)
  const [userId, setUserId] = useState(null)
  const [currentChat, setCurrentChat] = useState({chatId:null, chatType:null, chatMessages:null, chatFocusMessage:null, removeNotifications: null, chatData: null})
  const [newUserToAdd, setNewUserToAdd] = useState({id:null, userImage:null, userName:null, userDescription:null})
  const [chats, setChats] = useState(null)
  const [searchType, setSearchType] = useState("error")
  const box1 = useRef(null)
  const box2 = useRef(null)
  const [chatsStatus, setChatsStatus] = useState([])
  const [chatsImage, setChatsImage] = useState([])

  const socket = socketIOClient('http://localhost:3000');

  const handleResize = () => {
    if(window.innerWidth <= 850){
      setOneBoxeMode(true)
      setBoxes(boxes)
      box1.current.classList.remove("none")
      box2.current.classList.add("none")
    }else{
      setOneBoxeMode(false)
      box1.current.classList.remove("none")
      box2.current.classList.remove("none")
    }
  }

  useEffect(()=>{
    setWebSocket(socket)
    socket.on('updateUserChatCurrentStatus', data=>{
      setChatsStatus(CchatsStatus=>{
        const chatIndex = CchatsStatus.findIndex(i=>i.chatId == data.chatId)
        try{
          CchatsStatus[chatIndex].state = data.state
        }catch{
          CchatsStatus.push(data)
        }
        return [...CchatsStatus]
      })
    })

    window.addEventListener("resize", handleResize, false);
  }, [])

  useEffect(()=>{
    oneBoxeMode == null && handleResize()
  }, [oneBoxeMode])

  useEffect(()=>{
    if(oneBoxeMode){
      if(boxes.currentBox == 1){
        box2.current.classList.add("none")
        box1.current.classList.remove("none")
      }
  
      if(boxes.currentBox == 2){
        box1.current.classList.add("none")
        box2.current.classList.remove("none")
      }
    }
  }, [boxes])

  return (
    <CurrentChatContext.Provider value={[currentChat, setCurrentChat]}>
    <UserIdContext.Provider value={[userId, setUserId]}>
      <BoxesContext.Provider value={[boxes, setBoxes]}>
        <div className='app-margin'>
          {/* <Confirmation/> */}
          {/* <ImagePlayer/> */}
          {/* <VideoPlayer/> */}
          <div className='app-container'>
            <div ref={box1} className='box1'>
              {boxes.box1 == 'Chats' ? (
                  <Chats webSocket={webSocket} chatsStatus={chatsStatus} chatsImage={chatsImage} setChatsImage={setChatsImage} socket={socket} setSearchType={setSearchType} chats={chats} setChats={setChats}/>
                ) : boxes.box1 == 'UserOptions' ? (
                  <UserOptions webSocket={webSocket} setWebSocket={setWebSocket}/>
                ) : boxes.box1 == 'SearchUser' ? (
                  <SearchUser webSocket={webSocket} searchType={searchType} chats={chats} setNewUserToAdd={setNewUserToAdd} chatsImage={chatsImage} setChatsImage={setChatsImage}/>
                ) : boxes.box1 == 'AddUser' ? (
                  <AddUser webSocket={webSocket} newUserToAdd={newUserToAdd}/>
                ) : boxes.box1 == 'CreateGroup' && (
                  <CreateGroup webSocket={webSocket} chats={chats} chatsImage={chatsImage} setChatsImage={setChatsImage}/>
                )
              }
            </div>
            <div ref={box2} className='box2'>
              {boxes.box2 == 'Welcome' ? (
                  <Welcome/>
                ) : boxes.box2 == 'MessageBox' ? (
                  <MessageBox chatsStatus={chatsStatus} webSocket={webSocket} chatsImage={chatsImage}/>
                ) : boxes.box2 == 'GroupOption' ? (
                  <GroupOption webSocket={webSocket} chatsStatus={chatsStatus} chats={chats} CurrentUserId={userId}/>
                ) : boxes.box2 == 'ChatOption' ? (
                  <ChatOption webSocket={webSocket}/>
                ) : boxes.box2 == 'aboutMessage' && (
                  <AboutMessage webSocket={webSocket}/>
                )
              }
            </div>
          </div>
        </div>
      </BoxesContext.Provider>
    </UserIdContext.Provider>
  </CurrentChatContext.Provider>
  )
}

export default Home