import { useEffect} from 'react'
import useNotify from "../hooks/useNotify"

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  const { notification, setNotification} = useNotify()
  useEffect(() => { 
    if (!notification) return
    const timeoutId = setTimeout(() => {
      setNotification(null)
    }, 5000)
    return () => clearTimeout(timeoutId)
    }, [notification])
  
  if (!notification) return null


  

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification