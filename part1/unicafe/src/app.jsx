import { useState } from 'react'
const Statistics = (props) => {
  const good=props.good
  const neutral=props.neutral
  const bad=props.bad
  const total = good+neutral+bad
  const average=Math.round((good-bad)/(total===0? 1:total)*1000)/1000
  const positive=Math.round(good/(total===0? 1:total)*100*1000)/1000

  if (total===0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good}/>
          <StatisticLine text="neutral" value={neutral}/>
          <StatisticLine text="bad" value={bad}/>
          <StatisticLine text="Total" value={total}/>
          <StatisticLine text="Average score (good +1, bad -1, neutral 0)" value={average}/>
          <StatisticLine text="Positive rating proportion" value={positive}/> 
        </tbody>
      </table>
    </div>
  )

}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)
  const handleBadClick = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={()=>setGood(good+1)} text="good"/>
      <Button onClick={handleNeutralClick} text="neutral"/>
      <Button onClick={handleBadClick} text="bad"/>
      <Statistics good={good} bad={bad} neutral={neutral}/>
    </div>
  )
}

export default App