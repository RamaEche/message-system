import './Confirmation.css'
import {useState} from 'react'

function Confirmation({ cbFalse, cbTrue, text="Are you sure?" }){
    return (
      <div className='confirmation-bg'>
        <div className='confirmation-container'>
          <p>{text}</p>
          <div className='confirmation-options'>
            <button onClick={()=>cbFalse()}>No</button>
            <button onClick={()=>cbTrue()} className='confirmation-options-main'>Yes</button>
          </div>
        </div>
      </div>
    )
}

export default Confirmation