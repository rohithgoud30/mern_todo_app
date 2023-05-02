import { useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const user = useContext(UserContext)
  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post(
        'http://localhost:4000/register',
        { email, password },
        { withCredentials: true }
      )
      .then((res) => {
        user.setEmail(res.data.email)
        setEmail('')
        setPassword('')
        navigate('/')
        alert('Registration successful')
      })
      .catch((err) => {
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
        <br />
        <input type='submit' value='Register' />
      </form>
    </div>
  )
}

export default Register
