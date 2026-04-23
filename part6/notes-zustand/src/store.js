import { create } from 'zustand'
import noteService from './service/notes'
//import { devtools } from 'zustand/middleware'

// const logger = (config) => (set, get) => config(
//   (...args) => {
//     console.log('prev state', get());
//     set(...args);
//     console.log('next state', get());
//   },
//   get
// );
//const useNoteStore = create(devtools((set, get) ....)
const useNoteStore = create((set, get) => ({
  notes: [],
  filter: 'all',
  actions: {
    add: async (content) => {
      const note = await noteService.create(content)
      set(
        state => ({ notes: state.notes.concat(note) })
      )
    },
    toggleImportance: async (id) => {
      const note = get().notes.find(n => n.id === id)
      const updated=await noteService.update(id, {...note, important:!note.important})
      set(
        state => ({
          notes: state.notes.map(note =>
            note.id === id ? updated : note
          )
        })
      )
    },
    setFilter: value => set({ filter: value }),
    initialize: async () => {
      const notes = await noteService.getAll()
      set( () => ({notes}))
     }
  }
}))

export const useNotes = () => {
  const notes = useNoteStore(state => state.notes)
  const filter = useNoteStore(state => state.filter)
  if (filter === 'important') return notes.filter(n => n.important)
  if (filter === 'nonimportant') return notes.filter(n => !n.important)
  return notes
  }

export const useFilter = () => useNoteStore(state => state.filter)
export const useNotesActions = () => useNoteStore(state => state.actions)

export default useNoteStore