import { useCounterControls } from './store'
const Controls = () => {
  const { increment, decrement, zero } = useCounterControls()
  // const increment = useCounterStore(state => state.increment)
  // const decrement = useCounterStore(state => state.decrement)
  // const zero = useCounterStore(state => state.zero)

  return (
    <div>
      <button onClick={increment}>plus</button>
      <button onClick={decrement}>minus</button>
      <button onClick={zero}>zero</button>
    </div>)
}

export default Controls