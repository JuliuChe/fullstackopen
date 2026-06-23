import { useState } from 'react'

export const useCounter = () => { 
  const [value, setValue] = useState(0)
  const [count, setCount] = useState(0)

  const increment = () => { 
    setCount(c => c + 1)
  }
  const increase = () => { 
    setValue(c => c + 1)
    setCount(c => c + 1)
  }
  const decrease = () => { 
    setValue(c => c - 1)
    setCount(c => c + 1)
  }
  const zero = () => { 
    setValue(0)
    setCount(c => c + 1)
  }


  return {value, increase, decrease, zero, count, increment}
}