import React, { useState } from 'react'

const App = () => {
  const [counter, setCounter] = useState(0)
  const [decounter, setDeCounter] = useState(1000)

  return (
    <div>
      <p>count: {counter}</p>
      <button onClick={() => setCounter(counter + 1)}>increment</ button>
      <button onClick={() => setDeCounter(decounter - 1)}>decrement</ button>
      <p>decount: {decounter}</p>
    </div>
  )
}

export default App