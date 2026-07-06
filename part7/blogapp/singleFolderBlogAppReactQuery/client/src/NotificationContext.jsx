import {createContext, useReducer, useRef, useCallback } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => { 
  switch (action.type) {
    case 'ERROR':
        return { isError: true, message: action.message }
    case 'SUCCESS':
      return { isError: false, message: action.message }
    case 'CLEAR':
      return { isError: false, message: '' }
    default:
      return state
  }
}

export const NotificationContextProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, {isError:false, message:''})
  const timeoutRef = useRef(null)

  const notify = useCallback((message, isError=false, seconds = 5) =>{
    if (isError) {
      dispatch({ type: 'ERROR', message })
    } else {
      dispatch({type:'SUCCESS', message})
    }
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, seconds*1000)
  },[])

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext

