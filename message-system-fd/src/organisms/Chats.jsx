import './Chats.css'
import Chat from '../molecules/Chat'
import {useState, useContext} from 'react'
import {BoxesContext} from '../pages/Home'

function Chats() {

  const [boxes, setBoxes] = useContext(BoxesContext)

  const SearchChat = ()=>{
    setBoxes({box1:'SearchUser', box2:boxes.box2});
  }

  const UserOptions = ()=>{
    setBoxes({box1:'UserOptions', box2:boxes.box2});
  }

  const CreateGroup = ()=>{
    setBoxes({box1:'CreateGroup', box2:boxes.box2});
  }

  const AddUser = ()=>{
    setBoxes({box1:'AddUser', box2:boxes.box2});
  }

  return (
    <div className='chats-box'>
      <div className="bar">
        <div className="logo">
          <h1>Text message System</h1>
        </div>
        <div className='TaskBar'>
          <div className='buttons-pair'>
            <button onClick={()=>CreateGroup()} className='button'>G</button>
            <button onClick={()=>AddUser()} className='button'>C</button>
          </div>
          <div className='buttons-pair'>
            <button onClick={()=>SearchChat()} className='button'>S</button>
            <button onClick={()=>UserOptions()} className='button'>O</button>
          </div>
        </div>
      </div>
      <div className="chats">
        <Chat/>
        <Chat/>
      </div>
    </div>
  )
}

export default Chats