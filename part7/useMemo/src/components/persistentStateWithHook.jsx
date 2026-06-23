import { useLocalStorage } from '../hooks/useLocalStorage'

const PersistentStateWithHook = () => { 
  const [name, setName] = useLocalStorage('name', '')

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <p> {name && `Hello, ${name}! (your name is stored in localStorage)`} </p>
    </div>
  )
}

export default PersistentStateWithHook