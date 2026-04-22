import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ handler }) => {
  const [username, setUsername] = useState([])
  const [password, setPassword] = useState([])
  const navigate=useNavigate()

  const submitForm = async (event) => {
    event.preventDefault()
    await handler(username, password)
    setUsername('')
    setPassword('')
    navigate('/')
  }
  return (
    <form onSubmit={submitForm} aria-label="login form">
      <div>
        <h2>log in to application</h2>
        <div>
          <TextField label="username" value={username} onChange={({ target }) => setUsername(target.value)} variant="standard"/>
        </div>
        <div>
          <TextField label="password" value={password} type="password" onChange={({ target }) => setPassword(target.value)} variant="standard" />
        </div>
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>login</Button>
        </div>
      </div>
    </form>)
}

export default LoginForm