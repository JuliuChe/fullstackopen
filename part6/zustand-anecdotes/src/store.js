
import { create } from 'zustand'
import anecdoteService from './service/anecdotes'

const anecdotesAtStart = []

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const logger = (config) => (set, get) => config(
  (...args) => {
    console.log('prev state', get());
    set(...args);
    console.log('next state', get());
  },
  get
);

const useAnecdoteStore = create(logger((set, get) => ({
  anecdotes: anecdotesAtStart.map(asObject),
  filter: '',
  notification: '',
  notificationTimer:null,
  actions: {
    vote: async id => {
      const anecdote = get().anecdotes.find(anec => anec.id === id)
      const votedAnecdote = await anecdoteService.update(id, { ...anecdote, votes: anecdote.votes + 1 })
      set(
        state => ({
          anecdotes: state.anecdotes.map(anecdote =>
            anecdote.id === id ? votedAnecdote : anecdote
          )
        })
      )
      get().actions.notify(`You voted '${votedAnecdote.content}'`)
    },
    add: async (content) => {
      const newAnecdote =await anecdoteService.create(content)
      set(
        state => ({
          anecdotes:[...state.anecdotes, newAnecdote]
        })
      )
      get().actions.notify(`You added '${newAnecdote.content}'`)
    },
    setFilter: filter => set(() => ({
        filter:filter
      })
    ),
    initialize: async () => { 
      const anecdotes = await anecdoteService.getAll()
      set( () => ({anecdotes : anecdotes}))
    },
    notify: (message) => {
      const { notificationTimer } = get()
      if (notificationTimer) clearTimeout(notificationTimer)
      const timeout = setTimeout(() => set(
        { notification: '', notificationTimer:null }
      ), 5000)
      set(
        () => ({ notification: message, notificationTimer:timeout  })
      )
    },
    remove: async (id) => { 
      await anecdoteService.remove(id)
      const filtered = get().anecdotes.filter(anec => anec.id !== id)
      set({anecdotes:filtered})
    }
    
  },
})))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  const filtered = filter === '' ? anecdotes : anecdotes.filter(anecdote => anecdote.content.includes(filter))
  return filtered.toSorted((anec1, anec2) => anec2.votes - anec1.votes)
  
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export const useNotification = () => useAnecdoteStore((state) => state.notification)

export default useAnecdoteStore