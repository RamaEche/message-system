import './SearchUser.css'
import SerchedUser from "../molecules/SerchedUser"
import Chat from "../molecules/Chat"
import {useState, useEffect} from 'react'
import * as JsSearch from 'js-search';
import { useForm } from 'react-hook-form'
import Cookies from 'js-cookie'
import NoMoreUsers from '../atoms/NoMoreUsers'
import Loading from '../atoms/Loading'
import GoBackArrow from '../atoms/GoBackArrow.jsx'

function SearchUser({searchType, webSocket, chats, parentOrdedChats=[], setParentOrdedChats, setNewUserToAdd, header=true, setReturnCurrentSearchKnownUsers}) {
  const [token] = useState(Cookies.get('JwtToken'))
  const { register } = useForm()
  const [ordedChats, setOrdedChats] = useState([])
  const [lastSetTimeoutValue, setLastSetTimeoutValue] = useState(false)

  const postSearchKnownUsersByValue = (inputValue)=>{
    let inputSearchText = ""

    if(inputValue){
      inputSearchText = inputValue
    }

    var search = new JsSearch.Search('isbn');
    search.addIndex('Name');
    search.addDocuments(chats);
    let middleChat = search.search(inputSearchText.toLowerCase())[0];

    let unOrdedChats = chats.sort(function (a, b) {
      if(a.Name && b.Name){
        a.Name = a.Name.toLowerCase()
        b.Name = b.Name.toLowerCase()
  
        if (a.Name > b.Name) {
          return 1;
        }
        if (a.Name < b.Name) {
          return -1;
        }
      }
      return 0;
    })

    let middleChatPos = 0
    if(middleChat) middleChatPos = unOrdedChats.findIndex((element) => element.id == middleChat.id)

    if(middleChatPos != 0){
      let differentChats = unOrdedChats.slice(0, middleChatPos);
      unOrdedChats = unOrdedChats.slice(middleChatPos, unOrdedChats.length);
      setOrdedChats(unOrdedChats.concat(differentChats.reverse()))
    }else{
      setOrdedChats(unOrdedChats)
    }
  }

  const returnSearchKnownUsersByValue = (inputValue)=>{
    let inputSearchText = ""

    if(inputValue.target){
      inputSearchText = inputValue.target.value
    }

    var search = new JsSearch.Search('isbn');
    search.addIndex('Name');
    const parentOrdedUserChats = parentOrdedChats.filter(element => element.Type == "U")
    search.addDocuments(parentOrdedUserChats);
    let middleChat = search.search(inputSearchText.toLowerCase())[0];

    let unOrdedChats = parentOrdedUserChats.sort(function (a, b) {
      if(a.Name && b.Name){
        a.Name = a.Name.toLowerCase()
        b.Name = b.Name.toLowerCase()
  
        if (a.Name > b.Name) {
          return 1;
        }
        if (a.Name < b.Name) {
          return -1;
        }
      }
      return 0;
    })

    let middleChatPos = 0
    if(middleChat) middleChatPos = unOrdedChats.findIndex((element) => element.id == middleChat.id)

    if(middleChatPos != 0){
      let differentChats = unOrdedChats.slice(0, middleChatPos);
      unOrdedChats = unOrdedChats.slice(middleChatPos, unOrdedChats.length);
      setParentOrdedChats(unOrdedChats.concat(differentChats.reverse()))
    }else{
      setParentOrdedChats(unOrdedChats)
    }
  }

  const searchByKnownUsers = (e)=>{
    if(!e) return 0
    if(lastSetTimeoutValue) clearTimeout(lastSetTimeoutValue)

    const timeoutId = setTimeout((inputValue) => {
      postSearchKnownUsersByValue(inputValue)
    }, 800, e.target.value);

    setLastSetTimeoutValue(timeoutId)
  }

  const postSearchUnknownUsersByValue = (inputValue) => {
    webSocket.emit("postSearchUnknownUsers", {
      authorization: `Barrer ${token}`,
      inputValue
    });
    webSocket.on("postSearchUnknownUsers", info=>{
      setOrdedChats(info.arrayToSend)
    })
  }

  const searchByUnKnownUsers = (e)=>{
    if(!e) return 0
    if(lastSetTimeoutValue) clearTimeout(lastSetTimeoutValue)

    const timeoutId = setTimeout((inputValue) => {
      postSearchUnknownUsersByValue(inputValue)
    }, 800, e.target.value);

    setLastSetTimeoutValue(timeoutId)
  }

  const returnKnownUsers = (chatId)=>{
    let selectedChat
    setParentOrdedChats(currentOrdedChats=>{
      selectedChat = currentOrdedChats.filter(currentChat => currentChat.id == chatId)[0]
      currentOrdedChats = currentOrdedChats.filter(currentChat => currentChat.id != chatId)
      return currentOrdedChats
    })
    setReturnCurrentSearchKnownUsers(selectedChat)
  }

  useEffect(()=>{
    if(searchType == "unknownUsers"){
      postSearchUnknownUsersByValue("")
    }else if(searchType == "knownUsers"){
      postSearchKnownUsersByValue("")
    }else if(searchType == "returnKnownUsers"){
      returnSearchKnownUsersByValue("")
    }
  },[])

  return (
    <div className='search-user-container'>
      <div className={header ? 'search-user-bar' : 'none'}>
        <GoBackArrow changeTo="Chats" boxNumber={1}/>
        <h1 className='search-user-outstanding-logo'>Search user.</h1>
      </div>
      <div>
        <div className='search-user-input-container'>
          <div className="search-user-img-container">
            <div className='search-user-img-content'>
              <img src="search.png" className="search-user-img" />
            </div>
          </div>
          <input className='search-user-input' type='text' name='searchInput' {...register('searchInput', {
            onChange:searchType == "knownUsers" ? ((e)=>searchByKnownUsers(e)) :
            searchType == "unknownUsers" ? ((e)=>searchByUnKnownUsers(e)) :
            searchType == "returnKnownUsers" && ((e)=>returnSearchKnownUsersByValue(e))
          })}/>
        </div>
        <div className=''>
          {ordedChats == null && parentOrdedChats == null ?
            (
              <div className='search-user-loading'>
                <Loading/>
              </div>
            ): ordedChats.length == 0 && parentOrdedChats.length == 0 ?
            (
              <NoMoreUsers/>
            )
            :(
              searchType == "unknownUsers" ?
                ordedChats.map(({id, userName, userDescription}, i)=>{
                  return <SerchedUser id={id} userName={userName} userDescription={userDescription} setNewUserToAdd={setNewUserToAdd} key={i}/>
                })
                : searchType == "knownUsers" ?
                ordedChats.map((chat, i)=>{
                  return <Chat socket={webSocket} key={i} ChatID={chat.id} Type={chat.Type} Name={chat.Name} Description={chat.Description} UserCurrentState={chat.UserCurrentState}  IgnoredMessageCounter={chat.IgnoredMessageCounter}/>
                })
                : searchType == "returnKnownUsers" &&
                parentOrdedChats.map((chat, i)=>{
                  return <Chat onClick={returnKnownUsers} socket={webSocket} key={i} ChatID={chat.id} Type={chat.Type} Name={chat.Name} Description={chat.Description} UserCurrentState={chat.UserCurrentState}  IgnoredMessageCounter={chat.IgnoredMessageCounter}/>
                })
            )
          }
        </div>
      </div>
    </div>
  )
}

export default SearchUser