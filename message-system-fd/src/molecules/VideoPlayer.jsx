import './VideoPlayer.css'

function VideoPlayer(){
    return (
      <div className='video-player-bg'>
        <a className='video-player-go-back-arrow' href=''><img src='arrow.webp'/></a>
        <video className='video-reproductor' src="video2.mp4" controls></video>
        <p className='video-player-message'>Yes, this is it, right???</p>
      </div>
  )
}

export default VideoPlayer