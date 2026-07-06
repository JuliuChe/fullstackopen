import { create } from 'zustand'

const useNotificationStore = create((set, get) => ({
  notifValues: {
    isError: false,
    message: '',
    timeoutId: null
  },
  actions: {
    resetNotification: () => set({ notifValues: { isError: false, message: null, timeoutId: null } }),
    showNotification: (isError, message, duration = 5000) => {
    
      if (get().timeoutId) clearTimeout(get().timeoutId)
      
      const newTimeoutId = setTimeout(() => { 
        get().actions.resetNotification()
      }, duration)

      set({
        notifValues: { isError, message, timeoutId: newTimeoutId },
      })
    },
    launchError:(message) => get().actions.showNotification(true, message),
    launchSuccess:(message) => get().actions.showNotification(false, message),
    },  
}))

// the hook functions that are used elsewhere in app
export const useNotificationValues = () => useNotificationStore(state => state.notifValues)
export const useNotificationControls = () => useNotificationStore(state => state.actions)