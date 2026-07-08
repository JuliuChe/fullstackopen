import useField from '../hooks/useField'

import { FormControl, Input, Button, InputLabel } from '@mui/material'

const Login = ({ doLogin }) => {
  const username = useField('text')
  const password = useField('password')


  const handleLogin = async (event) => {
    event.preventDefault()
      await doLogin({ username:username.inputProps.value, password:password.inputProps.value })
      username.reset()
      password.reset()
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 8 }}>
          <FormControl>
            <InputLabel>username</InputLabel>
            <Input
              {...username.inputProps}
            />
          </FormControl>
        </div>
        <div style={{ marginBottom: 8 }}>
          <FormControl>
            <InputLabel>password</InputLabel>
            <Input
              {...password.inputProps}
            />
          </FormControl>
        </div>
        <div style={{ marginTop: 8 }}>
          <Button type="submit" variant="contained">
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Login
