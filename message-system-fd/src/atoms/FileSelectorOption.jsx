import './FileSelectorOption.css';

function MessageBox({className, onClick}) {
    return (
        <button onClick={()=>{onClick()}} className={className}>
            <div className='FileSelector-emojis'>
                <img className="FileSelector-emoji1 FileSelector-emoji" src={`${import.meta.env.VITE_FRONTEND_APP_URL}emoji1.svg`} />
                <img className="FileSelector-emoji2 FileSelector-emoji" src={`${import.meta.env.VITE_FRONTEND_APP_URL}emoji2.svg`} />
            </div>
        </button>
    )
}

export default MessageBox