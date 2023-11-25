import Chats from '../organisms/Chats'
import UserOptions from '../organisms/UserOptions'
import SearchUser from '../organisms/SearchUser'
import AddUser from '../organisms/AddUser'
import CreateGroup from '../organisms/CreateGroup'

import Welcome from '../organisms/Welcome'
import MessageBox from '../organisms/MessageBox'
import ChatOption from '../organisms/ChatOption'

import Confirmation from '../molecules/Confirmation'
import ImagePlayer from '../molecules/ImagePlayer'
import VideoPlayer from '../molecules/VideoPlayer'

import './Home.css'
import {useState, createContext} from 'react'

const BoxesContext = createContext()
export { BoxesContext }

function Home() {
  let [boxes, setBoxes] = useState({box1:'Chats', box2:'Welcome'})
  
  return (
    <BoxesContext.Provider value={[boxes, setBoxes]}>
      <div className='app-margin'>
        {/* <Confirmation/> */}
        {/* <ImagePlayer/> */}
        {/* <VideoPlayer/> */}
        <div className='app-container'>
          <div className='box1'>
            {boxes.box1 == 'Chats' ? (
                <Chats/>
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
                <MessageBox/>
              ) : boxes.box2 == 'ChatOption' && (
                <ChatOption/>
              )
            }
          </div>
        </div>
      </div>
    </BoxesContext.Provider>
  )
}

export default Home