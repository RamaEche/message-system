import Chats from '../organisms/Chats'
import Welcome from '../organisms/Welcome'
import './Home.css'

function AddUser() {
  return (
    <div className='app-margin'>
    <div className='app-container'>
      <div className='chat-container'><Chats/></div>
      <div className='messages-container'><Welcome/></div>
    </div>
  </div>
  )
}

export default AddUser