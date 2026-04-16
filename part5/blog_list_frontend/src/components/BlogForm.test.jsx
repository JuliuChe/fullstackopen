import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


describe('<BlogForm />', () => {
  test('blog form calls the handler createBlog with the right parameters',async () => {
    const user = userEvent.setup()

    const mockCreate = vi.fn()
    render(<BlogForm createBlog={mockCreate} />)

    const title = screen.getByLabelText('title:')
    const author = screen.getByLabelText('author:')
    const url = screen.getByLabelText('url:')
    const createBtn = screen.getByText('create')

    await userEvent.type(title, 'A new test on forms')
    await userEvent.type(author, 'A formers form')
    await userEvent.type(url, 'ww.formmyform.com')
    await user.click(createBtn)

    expect(mockCreate.mock.calls).toHaveLength(1)
    console.log(mockCreate.mock.calls)
    expect(mockCreate.mock.calls[0][0].title).toBe('A new test on forms')
    expect(mockCreate.mock.calls[0][0].author).toBe('A formers form')
    expect(mockCreate.mock.calls[0][0].url).toBe('ww.formmyform.com')
  })
})
