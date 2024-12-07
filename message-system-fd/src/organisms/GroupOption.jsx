import './GroupOption.css'
import {useState, useContext, useEffect, useRef} from 'react'
import {BoxesContext, CurrentChatContext} from "../pages/Home"
import { useForm } from 'react-hook-form'
import Confirmation from '../molecules/Confirmation'
import GroupUser from '../molecules/GroupUser'
import Cookies from 'js-cookie'

function GroupOption({ webSocket, chatsStatus, chats, CurrentUserId, chatsImage }) {
  const [token] = useState(Cookies.get('JwtToken'))
  const { register, handleSubmit, formState, watch, setValue } = useForm()
  const [boxes, setBoxes] = useContext(BoxesContext)
  const [currentChat] = useContext(CurrentChatContext)
  const [serverDataGeted, setServerDataGeted] = useState(null)
  let err = formState.errors;
  let files = [];
  const form = useRef(null)
  const [formError] = useState(false)
  const [chatImage, setChatImage] = useState(`${import.meta.env.VITE_FRONTEND_APP_URL}group.png`);
  const [openConfirmation1, setOpenConfirmation1] = useState(false)
  const [openConfirmation2, setOpenConfirmation2] = useState(false)

  const MessageBox = ()=>{
    setBoxes({box1:boxes.box1, box2:"MessageBox", currentBox:2})
  }

  watch('Name', '');
  watch('Description', '');

  useEffect(()=>{

    webSocket.emit("getGroupOptionData", {
      authorization: `Barrer ${token}`,
      ChatId:currentChat.chatId
    });
    webSocket.on("getGroupOptionData", info=>{
      const chatsImageIndex = chatsImage.findIndex(i=>i.chatID == currentChat.chatId)
      if(chatsImageIndex != -1){
        setChatImage(chatsImage[chatsImageIndex].src)
        setServerDataGeted(CurrentServerDataGeted=>({
          ...CurrentServerDataGeted,
          name: info.name,
          description: info.description,
          chatImage:chatsImage[chatsImageIndex].src
        }))
      }else{
        setServerDataGeted(CurrentServerDataGeted=>({
          ...CurrentServerDataGeted,
          name: info.name,
          description: info.description
        })) 
      }
    })
  }, [])

  //Reset form with the existing name.
  const resetForm = ()=>{
    form.current.reset();
    setChatImage(serverDataGeted.chatImage != null ? serverDataGeted.chatImage : `${import.meta.env.VITE_FRONTEND_APP_URL}group.png`)
    setValue('Name', serverDataGeted.name);
    setValue('Description', serverDataGeted.description);
    const chatsImageIndex = chatsImage.findIndex(i=>i.chatID == currentChat.chatId)
    if(chatsImageIndex != -1){
      setChatImage(chatsImage[chatsImageIndex].src)
    }
    //Set name input to the name given by the main user to that user.
  }

  const deletePhoto = ()=>{
    const CurrentName = watch('Name')
    const CurrentDescription = watch('Description')
    form.current.reset();
    setChatImage(`${import.meta.env.VITE_FRONTEND_APP_URL}group.png`)
    setValue('Name', CurrentName);
    setValue('Description', CurrentDescription);
  }

  useEffect(()=>{
    if(watch('Name') == ''){
      setValue('Name', serverDataGeted.name);
    }

    if(watch('Description') == ''){
      setValue('Description', serverDataGeted.description);
    }
  }, [serverDataGeted])

  //Upload form.
  const submitForm = (e)=>{
    const formData = new FormData();
    formData.append('Name', e.Name)
    formData.append('Description', e.Description)
    chatImage != `${import.meta.env.VITE_FRONTEND_APP_URL}group.png` ? formData.append('ChatImage', e.ChatImage[0]) : formData.append('ChatImage', "none")

    fetch(`${import.meta.env.VITE_SERVER_API_URL}UpdateGroup`, {
      method: 'POST',
      headers: {
        'authorization': `Barrer ${token}`,
        'ChatId':currentChat.chatId
      },
      body: formData
    })
    .then((res)=>{
      if(res.statusText == 'OK'){
        return res.blob()
      }else{
        console.error(res.statusText)
      }
    })
    .then(()=>{
      location.href = import.meta.env.VITE_FRONTEND_APP_URL;
    })
    .catch((err)=>{console.error(err)})
  }

  useEffect(()=>{
    if (watch('ChatImage')){
      files.push(watch('ChatImage')[0])
      if(watch('ChatImage').length != 0){
        const reader = new FileReader();
  
        reader.onload = function (e) {
          setChatImage(e.target.result);
        };
    
        reader.readAsDataURL(watch('ChatImage')[0]);
      }
    }
  }, [watch('ChatImage')])

  const leaveTheGroup = ()=>{
    webSocket.emit("postLeaveGroup", {
      authorization: `Barrer ${token}`,
      chatId:currentChat.chatId
    });
    webSocket.on("postLeaveGroup", info=>{
      setOpenConfirmation1(false)
      if(info.ok){
        location.href = import.meta.env.VITE_FRONTEND_APP_URL;
      }else{
        console.error(info)
      }
    })
  }

  const deleteGroup = ()=>{
    webSocket.emit("postDeleteGroup", {
      authorization: `Barrer ${token}`,
      chatId:currentChat.chatId
    });
    webSocket.on("postDeleteGroup", info=>{
      setOpenConfirmation1(false)
      if(info.ok){
        location.href = import.meta.env.VITE_FRONTEND_APP_URL;
      }else{
        console.error(info)
      }
    })
  }

  useEffect(()=>{
    if(watch('ChatImage')){
      files.push(watch('ChatImage')[0])
      if(watch('ChatImage').length != 0){
        const reader = new FileReader();
  
        reader.onload = function (e) {
          setChatImage(e.target.result);
        };
    
        reader.readAsDataURL(watch('ChatImage')[0]);
      }
    }
  }, [watch('ChatImage')])

  return (
    <div className='group-option-container'>
      <div className='group-option-bar'>
          <a className='group-option-go-back-arrow' onClick={()=>MessageBox()}><img src='arrow.png'/></a>
        <h1 className='group-option-outstanding-logo'>Text Message System</h1>
      </div>
      <div className='group-option-content'>
        <div className='group-option-content-scroll'>
          {serverDataGeted &&
            <>
                <form ref={form} onSubmit={handleSubmit((data)=>submitForm(data))} className='group-option-form'>
                  {formError &&
                    <div className='form-err-aclaration'>
                      <p>{formError}</p>
                    </div>
                  }
                  {err.ChatImage &&
                  <div className='form-err-aclaration sing-in-form-err-aclaration'>
                      <p>Profile photo error</p>
                    </div>
                  }
                  <div className='group-options-profile'>
                    <img className='group-options-profile-photo' src={chatImage}/>
                    <div className='group-options-profile-data'>
                      <input type='button' onClick={()=>deletePhoto()} className='link' value='Delete photo'/>
                      <div className='sing-in-image-selector link'>
                        <input type='file' name='ChatImage' {...register('ChatImage')}/>
                      </div>
                    </div>
                  </div>
                  <div className='group-options-container'>
                      <p>Name</p>
                      <input className='input-text' type='text' name='Name' {...register('Name', { required:true, maxLength: 20, minLength: 4})}/>
                      {err.Name &&
                        <div className='input-err-aclaration'>
                          <p>This field must contain between 4 and 20 characters</p>
                        </div>
                      }
                      <p>Description</p>
                      <input className='input-text' type='text' name='Description' {...register('Description', { required:true, maxLength: 80, minLength: 1})}/>
                      {err.Description &&
                        <div className='input-err-aclaration'>
                          <p>This field must contain between 1 and 80 characters</p>
                        </div>
                      }
                      <div className='group-options-form-changes-buttons'>
                        <input className='reset-button' onClick={()=>resetForm()} type='button' value='Reset'/>
                        <input className='main-button send-button' type='submit' value='Send'/>
                      </div>
                  </div>
                </form>
                <div className='group-options-bar-people-container'>
                  <p className='group-options-bar-people-title'>Group users:</p>
                  <div className='group-options-bar-people'>
                    { currentChat.chatData.users.map(({name, roll, userId}, i)=>(
                        <GroupUser key={i} name={name} roll={roll} userId={userId} chatsStatus={chatsStatus} webSocket={webSocket} chats={chats} CurrentUserId={CurrentUserId}/>
                      ))
                    }
                  </div>
                </div>
                {currentChat.chatData.users.length > 1 && <button className='user-options-link link-red' onClick={()=>setOpenConfirmation1(true)}>Leave the group</button>}
                {currentChat.chatData.users.find(i=>i.userId == CurrentUserId).roll == "A" && <button className='user-options-link link-red' onClick={()=>setOpenConfirmation2(true)}>Delete group</button>}
                {openConfirmation1 &&
                  <Confirmation cbFalse={()=>setOpenConfirmation1(false)} cbTrue={()=>leaveTheGroup()} text="Are you sure you want to leave the group?"/>
                }
                {openConfirmation2 &&
                  <Confirmation cbFalse={()=>setOpenConfirmation2(false)} cbTrue={()=>deleteGroup()} text="Are you sure you want to delete the group?"/>
                }
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default GroupOption