const App = () => {
  const course = 'Half Stack application development'
  const content=[{part: 'Fundamentals of React', exercises: 10},
  {part: 'Using props to pass data', exercises: 7},
  {part: 'State of a component', exercises: 14}]

  const part1 = {name: 'Fundamentals of React', exercises: 10}
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <div>
        <Header course={course} />
        <Content content={content}/>
        <Total content={content}/>
      </div>
    </div>
  )
}

const Header = (props) => {
  console.log(props)
  return (
    <h1>{props.course}</h1>
  )
}

const Course = (props) => {
  return (
    <p>{props.course.part} {props.course.exercises}</p>
  )
}

const Content = (props) => {
  return (
    <div>
       {props.content.map((course, index) => (
                    <Course key={index} course={course} />)
       )}    
    </div>
  )
}

const Total = (props) => {
  const total=props.content.reduce((sum, course) => sum + course.exercises, 0)  
  return (
    <p>Number of exercises {total}  </p>
  )
}

export default App