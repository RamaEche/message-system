import './FileSelectorOption.css';
import { useEffect, useState } from 'react';

function MessageBox({className, onClick, messageInputFileButton, setMessageInputFileButton}) {
    const [panel, setPanel] = useState("none")

    useEffect(()=>{
        if(messageInputFileButton == "open"){
            setPanel("")
        }
    }, [messageInputFileButton])
    return (
        <>
            <button onClick={(e)=>{e.preventDefault();onClick()}} className={className}>
                <div className='FileSelector-emojis'>
                    <img className="FileSelector-emoji1 FileSelector-emoji" src={`https://cdn.jsdelivr.net/npm/emoji-datasource-google/img/google/64/1f600.png`} />
                    <img className="FileSelector-emoji2 FileSelector-emoji" src={`https://cdn.jsdelivr.net/npm/emoji-datasource-google/img/google/64/1f60e.png`} />
                </div>
            </button>
            <div className={'fileSelector-close-panel '+panel} onClick={(e)=>{e.preventDefault();setMessageInputFileButton("close");setPanel("none")}}></div>
        </>
    )
}

export default MessageBox