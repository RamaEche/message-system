import './AddUser.css'
import {useState, useContext} from 'react'
import {BoxesContext} from "../pages/Home"

function AddUser() {

  const [boxes, setBoxes] = useContext(BoxesContext)

  const Chats = ()=>{
    setBoxes({box1:"Chats", box2:boxes.box2})
  }

  return (
    <div className='add-user-container'>
      <div className='add-user-bar'>
        <a className='add-user-go-back-arrow' onClick={()=>Chats()}><img src='arrow.png'/></a>
        <h1 className='add-user-outstanding-logo'>Text Message System</h1>
      </div>
      <form className='add-users-form-container'>
        <div className='add-users-profile-photo'>
          <img className='user-image-selector' src='https://cdn-icons-png.flaticon.com/512/5989/5989226.png'/>
          <p className='add-user-user-name'>@Mati2000</p>
          <p className='add-user-description'>Me llamo Matias, tengo 23 y me gusta el Jaz 😃</p>
        </div>
        <div className='add-users-container'>
            <p>Name</p>
            <input className='input-text' type='text'/>
            <div className='add-users-form-changes-buttons'>
              <input type='button' className='main-button' value="Talk"/>
            </div>
        </div>
      </form>
    </div>
  )
}

export default AddUser