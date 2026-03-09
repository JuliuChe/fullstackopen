const Header = (props) => <h1>{props.course}</h1>

const Content = ({parts}) => (
  <div>
    {parts.map((part) => <Part key={part.id} part={part}/>)}
  </div>
)
    // <Part part={props.parts[0]} />
    // <Part part={props.parts[1]} />
    // <Part part={props.parts[2]} />

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)
export const Course=({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={course.parts.reduce((sum, part) => sum+part.exercises ,0)}/>
    </div>
  )

}
const Total = (props) => <p><strong>Total of {props.total} exercises </strong></p>