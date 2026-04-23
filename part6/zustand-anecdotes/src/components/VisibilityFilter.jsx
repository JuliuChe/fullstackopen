import { useAnecdoteActions } from '../store'


const VisibilityFilter = () => { 
  const { setFilter } = useAnecdoteActions()
  const style = {
    marginBottom: 10
  }
  return (
    <div style={style}>
        <label>
        filter
        <input
          type="text"
          onChange={e => setFilter(e.target.value)}
        />
      </label>
    </div>
  )
}

export default VisibilityFilter