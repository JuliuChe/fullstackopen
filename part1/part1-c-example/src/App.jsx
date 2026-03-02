import { useState} from 'react'



const Hello = ({name, age}) => {
  const bornYear= () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old. 
        So you were probably born in {bornYear()} 
      </p>
    </div>
  )
}

const Display= (props) => {
  return (
    <div>
      Second counter value : {props.counter}
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const App = (props) => {
  const {counter} = props


  // setTimeout(() => {
  //   setSecondCounter(secondCoutner + 1)
  // }, 1000)
  const name = 'Peter'
  const age = 10

  const initialCounter = 1
  const [secondCoutner, setSecondCounter] = useState(initialCounter)
  
  console.log('rendering...', secondCoutner)

  if (secondCoutner==11) setSecondCounter(1)
  const increaseByOne =() => setSecondCounter(secondCoutner + 1)
  const resetCounter =() => setSecondCounter(initialCounter)
  const decreaseByOne =() => {
    if (secondCoutner > 1){
      setSecondCounter(secondCoutner - 1)
    }
  }
  return (
    <div>
      <h1>Greetings</h1>
      <p>Counter value: {counter}</p>
      <Display counter={secondCoutner} />
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
      <button onClick={() => setSecondCounter(secondCoutner + 1)}>Add one</button>
      <Button onClick={increaseByOne} text="Increase +1" />
      <Button onClick={decreaseByOne} text="Decrease -1" />
      <button onClick={resetCounter}>reset</button>
    </div>
  )
}

export default App
