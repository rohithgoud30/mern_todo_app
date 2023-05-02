import { useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(false)
  const navigate = useNavigate()

  const user = useContext(UserContext)
  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post(
        'http://localhost:4000/login',
        { email, password },
        { withCredentials: true }
      )
      .then((res) => {
        user.setEmail(res.data.email)
        setEmail('')
        setPassword('')
        setLoginError(false)
        navigate('/')
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setLoginError(true)
        }
        console.log('Error: ', err.response.message)
      })
  }

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type='email'
          name='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type='password'
          name='password'
          placeholder='Enter your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {loginError ? (
          <p style={{ color: 'red', margin: '0px', padding: '0px' }}>
            Email or Password is Wrong
          </p>
        ) : (
          <br />
        )}
        <input type='submit' value='Login' />
      </form>
    </div>
  )
}

export default Login
