import { useCounter } from '../hooks/useCounter'

const ManualCounter = () => { 
  const counter = useCounter()

  console.log(`Manual counter render ${counter.count}`)
  return (
    <div>
      <div>{counter.value}</div>
      <button onClick={counter.increase}>
        plus
      </button>
      <button onClick={counter.decrease}>
        minus
      </button>      
      <button onClick={counter.zero}>
        zero
      </button>
    </div>
  )
}

 
export default ManualCounter