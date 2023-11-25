import './SearchUser.css'
import SerchedUser from "../molecules/SerchedUser"
import {useState, useContext} from 'react'
import {BoxesContext} from "../pages/Home"

function SearchUser() {

  const [boxes, setBoxes] = useContext(BoxesContext)

  const Chats = ()=>{
    setBoxes({box1:"Chats", box2:boxes.box2})
  }

  return (
    <div className='search-user-container'>
      <div className='search-user-bar'>
        <a className='search-user-go-back-arrow' onClick={()=>Chats()}><img src='arrow.png'/></a>
        <h1 className='search-user-outstanding-logo'>Buscar usuario</h1>
      </div>
      <div>
        <div className='search-user-input-container'>
          <div className="search-user-img-container">
            <div className='search-user-img-content'>
              <img src="search.png" className="search-user-img" />
            </div>
          </div>
          <input className='search-user-input' type='text'/>
        </div>
        <div className=''>
          <SerchedUser user="@mati2000"/>
          <SerchedUser user="@luis5"/>
          <SerchedUser user="@xx_maria_xx"/>
        </div>
      </div>
    </div>
  )
}

export default SearchUser