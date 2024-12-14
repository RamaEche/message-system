import { Routes, Route } from "react-router-dom"
import './App.css'
import { useRealVh } from "./controllers/useRealVh";
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import SingIn from './pages/SingIn'
import RestorePassword from './pages/RestorePassword'

function App() {
  useRealVh();

  return (
    <>
    <Routes>
      <Route path="/" element={ <Home/> } />
      <Route path="LogIn" element={ <LogIn/> } />
      <Route path="SingIn" element={ <SingIn/> } />
      <Route path="RestorePassword" element={ <RestorePassword/> } />
    </Routes>
    </>
  )
}

export default App