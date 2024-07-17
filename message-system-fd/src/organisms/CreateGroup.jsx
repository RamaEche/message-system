import './CreateGroup.css'
import SearchUser from "../organisms/SearchUser"
import AddedUser from "../molecules/AddedUser"
import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import Cookies from 'js-cookie'
import GoBackArrow from '../atoms/GoBackArrow.jsx'

function CreateGroup({ webSocket, chats }) {
  const [chatsToAdd, setChatsToAdd] = useState([])
  const [formError, setFormError] = useState(false)
  const [returnCurrentSearchKnownUsers, setReturnCurrentSearchKnownUsers] = useState()
  const [parentOrdedChats, setParentOrdedChats] = useState(chats)
  const {handleSubmit, register, formState} = useForm()
  const [token] = useState(Cookies.get('JwtToken'))
  let err = formState.errors;

  useEffect(()=>{
    if(returnCurrentSearchKnownUsers != undefined){
      setChatsToAdd(currentChatsToAdd =>{
        return [...currentChatsToAdd, returnCurrentSearchKnownUsers]
      })
    }
  },[returnCurrentSearchKnownUsers])

  const removeUser = (id)=>{
    setChatsToAdd(currentChatsToAdd =>{
      currentChatsToAdd = currentChatsToAdd.filter(x => x.id != id)
      return currentChatsToAdd
    })
    setParentOrdedChats(currentOrdedChats =>{
      const chatToAdd = chats.filter(x =>x.id == id)[0]
      currentOrdedChats = [...currentOrdedChats, chatToAdd]
      return currentOrdedChats
    })
  }

  const createGroup = (e)=>{
    let chatsIdToAdd = []
    chatsToAdd.map(({id})=>{
      chatsIdToAdd.push(id)
    })
    webSocket.emit("postCreateGroup", {
      authorization: `Barrer ${token}`,
      name:e.name,
      description:e.description,
      chatsIdToAdd
    });
    webSocket.on("postCreateGroup", info=>{
      if(info.ok){
        location.href = import.meta.env.VITE_FRONTEND_APP_URL;
      }else{
        console.error(info)
        switch (info.err) {
          case "chatInCommon":
            setFormError("You already have a chat with this user.")
            break;
          default:
            setFormError("Unknown error, try later.")
            console.error("Unknown error")
            break;
        }
      } 
    })
  }

  return (
    <>
      <div className='create-group-container'>
        <div className='create-group-bar'>
          <GoBackArrow changeTo="Chats" boxNumber={1}/>
          <h1 className='create-group-outstanding-logo'>Create group</h1>
        </div>
        <form onSubmit={handleSubmit((e)=>createGroup(e))}>
          {formError &&
            <div className='form-err-aclaration'>
              <p>{formError}</p>
            </div>
          }
          <div className='create-group-files'>
            <p>Group name</p>
            <input className='input-text' type='text' name="name" {...register("name", {required: true, maxLength: 20, minLength: 4})}/>
            {err.name &&
              <div className='input-err-aclaration'>
                <p>This field must contain between 4 and 20 characters.</p>
              </div>
            }
            <p>Description</p>
            <input className='input-text' type='text' name="description" {...register("description", { required: true, maxLength: 80, minLength: 1})}/>
            {err.name &&
              <div className='input-err-aclaration'>
                <p>This field must contain between 1 and 80 characters</p>
              </div>
            }
            <input className='main-button create-group-files-button send-button' type='submit' value="Create group"/>
          </div>
          <h2 className='add-user-added-users-title'>Add user:</h2>
          <div className='create-group-added-users'>
            {chatsToAdd.map(({Name, id}, i)=>{
              return <AddedUser onClick={removeUser} Name={Name} id={id} key={i}/>
            })}
          </div>
          <div className='create-group-input-container'>
            <SearchUser searchType="returnKnownUsers" webSocket={webSocket} chats={chats} parentOrdedChats={parentOrdedChats} setParentOrdedChats={setParentOrdedChats} header={false} setReturnCurrentSearchKnownUsers={setReturnCurrentSearchKnownUsers}/>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateGroup