import './AddedUser.css'
import {useEffect, useState} from 'react'

function AddedUser( { Name, id, onClick, chatsImage } ){
  const [photoSrc, setPhotoSrc] = useState(`${import.meta.env.VITE_FRONTEND_APP_URL}group.png`)

  useEffect(()=>{
    let imgIndx = chatsImage.findIndex(i=>i.chatID == id)
    imgIndx != -1 && setPhotoSrc(chatsImage[imgIndx].src)
  }, [id])

  return (
    <>
      <div className='added-user-container-curtain-remove' onClick={()=>onClick(id)}>
        <img className="added-user-close" src={`${import.meta.env.VITE_FRONTEND_APP_URL}close.png`}/>
      </div>
      <div className='added-user-container'>
        <img className="added-user-chat-image" src={photoSrc}/>
        <p>{Name}</p>
      </div>
    </>
  )
}

export default AddedUser