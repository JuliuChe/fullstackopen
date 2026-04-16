import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Note } from './Note'

test('renders content of a note with getByText', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(< Note note={note} />)
  const element = screen.getByText('Component testing is done with react-testing-library', { exact:false })
  expect(element).toBeDefined()
})


test('renders content of a note with findByText', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(< Note note={note} />)

  const findElem = await screen.findByText('Component testing is done with react-testing-library !!!')
  expect(findElem).toBeDefined()
})

test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
})

test('renders content with querySelector is not recommended', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const { container } = render(<Note note={note} />)

  const div = container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})

test('renders content of a note with a debug', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(< Note note={note} />)
  // screen.debug()
  const element = screen.getByText('Component testing is done with react-testing-library !!!')
  // screen.debug(element)
  expect(element).toBeDefined()
})

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = vi.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})