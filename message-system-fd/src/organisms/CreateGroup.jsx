import './CreateGroup.css'
import SerchedUser from "../molecules/SerchedUser"
import AddedUser from "../molecules/AddedUser"
import {useState, useContext} from 'react'
import {BoxesContext} from "../pages/Home"

function CreateGroup() {

  const [boxes, setBoxes] = useContext(BoxesContext)

  const Chats = ()=>{
    setBoxes({box1:"Chats", box2:boxes.box2})
  }

  return (
    <>
      <div className='create-group-container'>
        <div className='create-group-bar'>
          <a className='create-group-go-back-arrow' onClick={()=>Chats()}><img src='arrow.png'/></a>
          <h1 className='create-group-outstanding-logo'>Buscar usuario</h1>
        </div>
        <div>
          <div className='create-group-files'>
            <p>Group name</p>
            <input className='input-text' type='text'/>
            <p>Description</p>
            <input className='input-text' type='text'/>
            <input className='main-button create-group-files-button' type='button' value="Create group"/>
          </div>
          <h2 className='add-user-added-users-title'>Add user:</h2>
          <div className='create-group-added-users'>
            <AddedUser Name="Juan"/>
            <AddedUser Name="Juan"/>
            <AddedUser Name="Juan"/>
            <AddedUser Name="Juan"/>
          </div>
          <div className='create-group-input-container'>
            <div className="create-group-img-container">
              <div className='create-group-img-content'>
                <img src="search.png" className="create-group-img" />
              </div>
            </div>
            <input className='create-group-input' type='text'/>
          </div>
          <div className=''>
            <SerchedUser user="@mati2000"/>
            <SerchedUser user="@luis5"/>
            <SerchedUser user="@xx_maria_xx"/>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateGroup