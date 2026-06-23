import { useCounter } from '../hooks/useCounter'

const LeftRightCounter = () => { 
  const left = useCounter()
  const right = useCounter()
  console.log(`Left counter render ${left.count}`)
  console.log(`Right counter render ${right.count}`)
  return (
    <div>
      {left.value}
      <button onClick={left.increase}>
        Left
      </button>
      <button onClick={right.increase}>
        Right
      </button>    
      {right.value}
    </div>
  )
}

 
export default LeftRightCounter