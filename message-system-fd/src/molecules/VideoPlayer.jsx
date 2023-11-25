import './VideoPlayer.css'
import {useState} from 'react'

function VideoPlayer(){
    return (
      <div className='video-player-bg'>
        <a className='video-player-go-back-arrow' href=''><img src='arrow.png'/></a>
        <video className='video-reproductor' src="video2.mp4" controls></video>
        <p className='video-player-message'>Si, es esta no???</p>
      </div>
  )
}

export default VideoPlayer