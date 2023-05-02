import './App.css'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { UserContext } from './context/userContext'
import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleLogout = () => {
    axios
      .get('http://localhost:4000/logout', { withCredentials: true })
      .then(() => {
        setEmail('')
        navigate('/')
      })
      .catch((err) => console.log(err.data.message))
  }

  useEffect(() => {
    axios
      .get('http://localhost:4000/user', { withCredentials: true })
      .then((res) => {
        setEmail(res.data.email)
      })
      .catch((err) => console.log(err.data.message))
  }, [])

  return (
    <UserContext.Provider value={{ email, setEmail }}>
      <nav>
        <Link to='/'>Home</Link>
        {!email && (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
        {email && (
          <>
            <Link to='/' onClick={handleLogout}>
              Logout
            </Link>
          </>
        )}
      </nav>
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </main>
    </UserContext.Provider>
  )
}

export default App
