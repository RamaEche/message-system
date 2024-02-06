import Chats from '../organisms/Chats'
import UserOptions from '../organisms/UserOptions'
import SearchUser from '../organisms/SearchUser'
import AddUser from '../organisms/AddUser'
import CreateGroup from '../organisms/CreateGroup'

import Welcome from '../organisms/Welcome'
import MessageBox from '../organisms/MessageBox'
import ChatOption from '../organisms/ChatOption'
import AboutMessage from '../organisms/AboutMessage'

import Confirmation from '../molecules/Confirmation'
import ImagePlayer from '../molecules/ImagePlayer'
import VideoPlayer from '../molecules/VideoPlayer'

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
  const [currentChat, setCurrentChat] = useState({chatId:null, chatMessages:null, chatFocusMessage:null, removeNotifications: null})
  
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
                    <Chats webSocket={webSocket} setWebSocket={setWebSocket}/>
                  ) : boxes.box1 == 'UserOptions' ? (
                    <UserOptions/>
                  ) : boxes.box1 == 'SearchUser' ? (
                    <SearchUser/>
                  ) : boxes.box1 == 'AddUser' ? (
                    <AddUser/>
                  ) : boxes.box1 == 'CreateGroup' && (
                    <CreateGroup />
                  )
                }
              </div>
              <div className='box2'>
                {boxes.box2 == 'Welcome' ? (
                    <Welcome/>
                  ) : boxes.box2 == 'MessageBox' ? (
                    <MessageBox webSocket={webSocket}/>
                  ) : boxes.box2 == 'ChatOption' ? (
                    <ChatOption/>
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