import './SerchedUser.css'
import {useState} from 'react'

function SerchedUser( { user } ){
    return (
        <div className='searched-user'>
            <img className='searched-user-img' src='https://cdn-icons-png.flaticon.com/512/5989/5989226.png'/>
            <p className='searched-user-user'>{ user }</p>
        </div>
    )
}

export default SerchedUser