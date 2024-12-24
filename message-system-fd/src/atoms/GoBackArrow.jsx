import './GoBackArrow.css'
import {useContext} from 'react'
import {BoxesContext} from "../pages/Home"

function GoBackArrow({changeTo, boxNumber}) {
  const [boxes, setBoxes] = useContext(BoxesContext)
  const Chats = ()=>{
    if(boxNumber == 1){
      setBoxes({box1:changeTo, box2:boxes.box2, currentBox:boxNumber})
    }else{
      setBoxes({box1:boxes.box1, box2:changeTo, currentBox:boxNumber})
    }
  }
  return (
    <a onClick={()=>Chats()} className='go-back-arrow'><img src='arrow.webp'/></a>
  )
}

export default GoBackArrow