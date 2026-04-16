import { useState } from 'react'
import Field from './Field'

const LoginForm = ({ handler }) => {
  const [username, setUsername] = useState([])
  const [password, setPassword] = useState([])
  const submitForm = (event) => {
    event.preventDefault()
    handler(username, password)
    setUsername('')
    setPassword('')
  }
  return (
    <form onSubmit={submitForm} aria-label="login form">
      <div>
        <h1>log in to application</h1>
        <Field name="username" value={username} onChange={({ target }) => setUsername(target.value)} />
        <Field name="password" value={password} type="password" onChange={({ target }) => setPassword(target.value)} />
        <button type="submit">login</button>
      </div>
    </form>)
}

export default LoginForm