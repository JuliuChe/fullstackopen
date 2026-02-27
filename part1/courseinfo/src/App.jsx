const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

const Header = (props) => {
  console.log(props)
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  props.parts.forEach(element => {
    console.log(element)
  });
  return (
    <div>
      {props.parts.map((elem,idx) => <Part key={idx} part={elem} />)}
      <h2> Old way </h2>
      <Part part={props.parts[0]}  />
      <Part part={props.parts[1]}  />
      <Part part={props.parts[2]}  />
    </div>
  )
}

const Part = (props) => {
  return (
   <p> {props.part.name} {props.part.exercises} </p> 
  )
}
const Total = (props) => {
  let sum=0
  props.parts.forEach(element => {
    sum += element.exercises
  });
  return (
    <p>Number of exercises {sum}  </p>
  )
}

export default App