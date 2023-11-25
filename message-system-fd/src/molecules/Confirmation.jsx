import './Confirmation.css'
import {useState} from 'react'

function Confirmation(){
    return (
      <div className='confirmation-bg'>
        <div className='confirmation-container'>
          <p>Are you sure you want to block Matias?</p>
          <div className='confirmation-options'>
            <button>No</button>
            <button className='confirmation-options-main'>Yes</button>
          </div>
        </div>
      </div>
    )
}

export default Confirmation