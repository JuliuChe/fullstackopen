import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = ({ show, setToken }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [onLogin] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  })

  const submit = async (event) => {
    event.preventDefault()

    //  try {
    await onLogin({ variables: { username: username, password: password } })
    // } catch (error) {
    //   setError(error.message)
    // }

    setUsername('')
    setPassword('')
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          username{' '}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Log in</button>
      </form>
    </div>
  )
}

export default LoginForm
