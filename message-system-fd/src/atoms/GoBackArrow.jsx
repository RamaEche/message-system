import './GoBackArrow.css'
import {useContext} from 'react'
import {BoxesContext} from "../pages/Home"

function GoBackArrow({changeTo, boxNumber}) {
  const [boxes, setBoxes] = useContext(BoxesContext)
  const Chats = ()=>{
    if(boxNumber == 1){
      setBoxes({box1:changeTo, box2:boxes.box2, currentBox:changeTo})
    }else{
      setBoxes({box1:boxes.box1, box2:changeTo, currentBox:changeTo})
    }
  }
  return (
    <a onClick={()=>Chats()} className='go-back-arrow'><img src='arrow.png'/></a>
  )
}

export default GoBackArrow