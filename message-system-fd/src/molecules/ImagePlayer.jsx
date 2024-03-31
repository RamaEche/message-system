import './ImagePlayer.css'

function ImagePlayer(){
    return (
      <div className='image-player-bg'>
        <a className='image-player-go-back-arrow' href=''><img src='arrow.png'/></a>
        <img src='https://concepto.de/wp-content/uploads/2015/03/paisaje-2-e1549600987975.jpg' className='image-reproductor'/>
        <p className='image-player-message'>Si, es esta no???</p>
      </div>
    )
}

export default ImagePlayer