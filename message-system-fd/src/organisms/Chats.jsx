import './Chats.css'
import Chat from '../molecules/Chat'
import {useState, useContext, useEffect, useRef} from 'react'
import {BoxesContext} from '../pages/Home'
import Cookies from 'js-cookie'

function Chats() {

  const mounted = useRef(false);
  const [chats, setChats] = useState(null)
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
    setBoxes({box1:'SearchUser', box2:boxes.box2}); //The user is searched and then added
  }

  const GetChats = ()=>{
    const token = Cookies.get("JwtToken")
    fetch(`${import.meta.env.VITE_SERVER_API_URL}UserChats`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Barrer ${token}`
      },
    })
    .then((res)=>res.json())
    .then((info)=>{
      if(info.err == 'Invalid token') location.href = `${import.meta.env.VITE_FRONTEND_APP_URL}login`
      setChats(info)
    })
    .catch((err)=>{throw new Error(err)})
  }

  useEffect(()=>{
    if (!mounted.current) {
    GetChats()
    mounted.current = true;
    }
  }, []);

  return (
    <div className='chats-box'>
      <div className="bar">
        <div className="logo">
          <h1>Text Message System</h1>
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
        {chats == null ?
        (
          <div>loading...</div>
        ):
        (
          chats.chats.map((chat, i)=>{
            return <Chat key={i} ChatID={chat.id} Type={chat.Type} Name={chat.Name} Description={chat.Description} UserCurrentState={chat.UserCurrentState}  IgnoredMessageCounter={chat.IgnoredMessageCounter}/>
          })
        )}
      </div>
    </div>
  )
}

export default Chats