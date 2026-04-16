import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'

// const promise = axios.get('http://localhost:3001/notes')
// promise.then(response =>{
//     console.log(response.data)
//     ReactDOM.createRoot(document.getElementById('root')).render(
//     <App notes={response.data} />)
//     },
//     response =>{console.log("error", response)})

// const promise2 = axios.get('http://localhost:3001/foobar')
// promise2.then(response =>{console.log(response.data)}, response =>{console.log("error", response)})

// const notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     important: true
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only JavaScript',
//     important: false
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     important: true
//   }
// ]

//ReactDOM.createRoot(document.getElementById('root')).render(
//     <App notes={response.data} />)
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>)