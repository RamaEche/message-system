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
import {useState, createContext} from 'react'

const BoxesContext = createContext()
const UserIdContext = createContext()
const CurrentChatContext = createContext()
export { BoxesContext, UserIdContext, CurrentChatContext }

function Home() {
  const [boxes, setBoxes] = useState({box1:'Chats', box2:'Welcome'})
  const [webSocket, setWebSocket] = useState(null)
  const [userId, setUserId] = useState(null)
  const [currentChat, setCurrentChat] = useState({chatId:null, chatType:null, chatMessages:null, chatFocusMessage:null, removeNotifications: null, chatData: null})
  const [newUserToAdd, setNewUserToAdd] = useState({id:null, userImage:null, userName:null, userDescription:null})
  const [chats, setChats] = useState(null)
  const [searchType, setSearchType] = useState("error")

  return (
    <CurrentChatContext.Provider value={[currentChat, setCurrentChat]}>
      <UserIdContext.Provider value={[userId, setUserId]}>
        <BoxesContext.Provider value={[boxes, setBoxes]}>
          <div className='app-margin'>
            {/* <Confirmation/> */}
            {/* <ImagePlayer/> */}
            {/* <VideoPlayer/> */}
            <div className='app-container'>
              <div className='box1'>
                {boxes.box1 == 'Chats' ? (
                    <Chats webSocket={webSocket} setWebSocket={setWebSocket} setSearchType={setSearchType} chats={chats} setChats={setChats}/>
                  ) : boxes.box1 == 'UserOptions' ? (
                    <UserOptions webSocket={webSocket}/>
                  ) : boxes.box1 == 'SearchUser' ? (
                    <SearchUser webSocket={webSocket} searchType={searchType} chats={chats} setNewUserToAdd={setNewUserToAdd}/>
                  ) : boxes.box1 == 'AddUser' ? (
                    <AddUser webSocket={webSocket} newUserToAdd={newUserToAdd}/>
                  ) : boxes.box1 == 'CreateGroup' && (
                    <CreateGroup webSocket={webSocket}/>
                  )
                }
              </div>
              <div className='box2'>
                {boxes.box2 == 'Welcome' ? (
                    <Welcome/>
                  ) : boxes.box2 == 'MessageBox' ? (
                    <MessageBox webSocket={webSocket}/>
                  ) : boxes.box2 == 'GroupOption' ? (
                    <GroupOption webSocket={webSocket}/>
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