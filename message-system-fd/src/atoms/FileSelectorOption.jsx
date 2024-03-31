import './FileSelectorOption.css';

function MessageBox({cb}) {
    return (
        <button onClick={()=>{cb()}} className='file-selector-option-container'><img src="https://cdn.icon-icons.com/icons2/2645/PNG/512/vector_pen_icon_159770.png" alt="sfadsd" /></button>
    )
}

export default MessageBox