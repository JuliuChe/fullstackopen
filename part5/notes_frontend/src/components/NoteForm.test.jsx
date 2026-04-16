import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  // const input = screen.getByRole('textbox') // -> Ok if only 1 textbox
  // const input = screen.getByLabelText('content') // -> Ok if input field has a label (i.e. <label>a label <input value={....}/></label>)
  const input = screen.getByPlaceholderText('a new hope...')
  const sendButton = screen.getByText('save')

  // await user.clear(input)
  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  console.log(createNote.mock.calls)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})