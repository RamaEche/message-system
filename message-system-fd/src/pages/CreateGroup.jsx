import Chats from '../organisms/Chats'
import Welcome from '../organisms/Welcome'
import './Home.css'

function CreateGroup() {
  return (
    <div className='app-margin'>
      <div className='app-container'>
        <div className='chat-container'><Chats/></div>
        <div className='messages-container'><Welcome/></div> {/* Welcome o message si hay almacenado el chat de alguien*/}
      </div>
    </div>
  )
}

export default CreateGroup