import Chats from '../organisms/Chats'
import Welcome from '../organisms/Welcome'
import './Home.css'

function CreateGroup() {
  return (
    <div className='app-margin'>
      <div className='app-container'>
        <div className='chat-container'><Chats/></div>
        <div className='messages-container'><Welcome/></div> {/* Welcome or message if someone's chat is stored. */}
      </div>
    </div>
  )
}

export default CreateGroup