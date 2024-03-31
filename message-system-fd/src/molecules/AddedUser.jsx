import './AddedUser.css'

function AddedUser( { Name } ){
    return (
        <div className='added-user-container'>
          <img src='https://cdn-icons-png.flaticon.com/512/5989/5989226.png'/>
          <p>{Name}</p>
        </div>
    )
}

export default AddedUser