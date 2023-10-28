import { Routes, Route } from "react-router-dom"
import './App.css'
import Home from './pages/Home'
import AddUser from './pages/AddUser'
import Chat from './pages/Chat'
import CreateGroup from './pages/CreateGroup'
import LogIn from './pages/LogIn'
import SingIn from './pages/SingIn'
import RestorePassword from './pages/RestorePassword'

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={ <Home/> } />
      <Route path="AddUser" element={ <AddUser/> } />
      <Route path="/Chat" element={ <Chat/> } />
      <Route path="CreateGroup" element={ <CreateGroup/> } />
      <Route path="LogIn" element={ <LogIn/> } />
      <Route path="SingIn" element={ <SingIn/> } />
      <Route path="RestorePassword" element={ <RestorePassword/> } />
    </Routes>
    </>
  )
}

export default App
