import React from 'react'

const Hello=(props)=>{
  return (
    <div>
      <p>Hello world {props.name}, it is {props.date.toString()}, you are {props.age} years old</p>
    </div>
  )
}

const Friends = () => {
  const friends = [
    { name: 'Peter', age: 4 },
    { name: 'Maya', age: 10 },
  ]

  return (
    <div>
      <p>{friends[0].name}, age {friends[0].age}</p>
      <p>{friends[1].name}, age {friends[1].age}</p>
    </div>
  )
}


const App = () => {
  const now = new Date()
  const tomorrow = new Date(now)
  const oneMonth = new Date(now)
  oneMonth.setMonth(oneMonth.getMonth() + 1)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const age = 30
  const a = 10
  const b = 20
  console.log(now, a+b)
  console.log("Version of react", React.version)
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Jean" date={now} age={age}/>
      <Hello name="Arthur" date={tomorrow} age={22}/>
      <Hello name="Marie" date={oneMonth} age={25-5}/>
      <Friends />
      <p>{a} plus {b} is {a+b}</p>
    </div>
  )

}

export default App