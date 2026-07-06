import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

export const useNotification = () => useContext(NotificationContext).notification
export const useNotify = () => useContext(NotificationContext).notify
