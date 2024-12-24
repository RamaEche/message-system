import { useEffect } from 'react'
import './Welcome.css'

function Welcome({ setBox2Loaded }) {
  useEffect(()=>{
    setBox2Loaded(true)
  }, [])
  return (
    <div className='welcome-container'>
        <img src="/icon.svg" alt="Text message system logo" />
        <h2>Text message system</h2>
        <p>Chat with your friends, join groups and share all kinds of information with complete privacy.</p>
    </div>
  )
}

export default Welcome