import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'
import { useAnecdotes } from '../hooks'

const CreateNew = () => {
  const navigate = useNavigate()

  const content = useField('content')
  const author = useField('author')
  const info = useField('info')
  
  const { reset: resCo, ...contentInput } = content 
  const { reset: resAu, ...authorInput } = author
  const { reset: resIn, ...infoInput } = info

  const { _, addAnecdote, __ } = useAnecdotes()


  const handleSubmit = async (e) => {
    e.preventDefault()
    await addAnecdote({content: content.value, author: author.value, info: info.value, votes: 0 })
    navigate('/')
  }

  const resetAll = () => { 
    resCo()
    resAu()
    resIn()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentInput } />
        </div>
        <div>
          author
          <input {...authorInput} />
        </div>
        <div>
          url for more info
          <input {...infoInput} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={resetAll}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
