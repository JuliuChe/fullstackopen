import { Alert } from '@mui/material'
import { useNotification } from '../hooks/useNotification'

const Notification = () => {
  const  notification  = useNotification()
  const { isError, message } = notification

  if (!message) {
    return null
  }

  return (
    <Alert severity={isError ? 'error' : 'success'} sx={{ my: 2 }}>
      {message}
    </Alert>
  )
}

export default Notification
