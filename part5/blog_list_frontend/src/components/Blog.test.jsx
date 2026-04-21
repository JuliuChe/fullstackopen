import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { BrowserRouter as Router, MemoryRouter as TestRouter } from 'react-router-dom'

let container
let mockLike
let mockRemove
let blog

describe('<Blog />', () => {
  beforeEach( () => {
    blog = {
      title: 'A blog for a test',
      author: 'TesterMan',
      url: 'www.testablog.com',
      likes: 1738,
      id: 1234,
      user: {
        name: 'Jleux Test',
        username: 'mr_test',
        id: 7890
      }
    }

    mockLike = vi.fn()
    mockRemove = vi.fn()

  })

  test('renders a blog with author and title when no user is logged in', () => {
    container = render(
      <TestRouter>
        <Blog blog={blog} handleLike={mockLike} handleRemove={mockRemove} />
      </TestRouter>
    ).container

    const myBlog = container.querySelector('.details')
    const author = screen.getByTestId('author_det')
    const title = screen.getByTestId('title_det')
    const url = screen.getByTestId('url')
    const likes = screen.getByTestId('likes')

    expect(myBlog).toHaveTextContent('A blog for a test')
    expect(myBlog).toHaveTextContent('TesterMan')
    expect(author).toBeVisible()
    expect(title).toBeVisible()
    expect(myBlog).toHaveTextContent('www.testablog.com')
    expect(myBlog).toHaveTextContent('1738')
    expect(url).toBeVisible()
    expect(likes).toBeVisible()
    expect(screen.queryByText('like')).toBeNull()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('renders a blog with only a like button - Another user is logged in', async () => {

    window.localStorage.setItem('loggedBlogappUser', JSON.stringify({ token: '12353034287742', name: 'Mr. Oizoman', username: 'oizo' }))
    container = render(
      <TestRouter>
        <Blog blog={blog} handleLike={mockLike} handleRemove={mockRemove} />
      </TestRouter>
    ).container
    const user = userEvent.setup()
    const button = screen.getByText('like')

    const myBlog = container.querySelector('.details')
    const author = screen.getByTestId('author_det')
    const title = screen.getByTestId('title_det')
    const url = screen.getByTestId('url')
    const likes = screen.getByTestId('likes')
    // console.log(myBlog.innerHTML)
    console.log(author.innerHTML, title.innerHTML, url.innerHTML, likes.innerHTML)
    expect(myBlog).toHaveTextContent('A blog for a test')
    expect(myBlog).toHaveTextContent('TesterMan')
    expect(myBlog).toHaveTextContent('www.testablog.com')
    expect(myBlog).toHaveTextContent('1738')
    expect(author).toBeVisible()
    expect(title).toBeVisible()
    expect(url).toBeVisible()
    expect(likes).toBeVisible()
    expect(button).toBeVisible()
    expect(screen.queryByText('remove')).toBeNull()
    await user.click(button)
    expect(mockLike.mock.calls).toHaveLength(1)
    expect(mockLike).toHaveBeenCalledWith(blog)


  })

  test('renders a blog with like and remove button - same user loggged in', async () => {

    window.localStorage.setItem('loggedBlogappUser', JSON.stringify({ token: '12353034287742', name: 'Jleux Test', username: 'mr_test' }))
    container = render(
      <TestRouter>
        <Blog blog={blog} handleLike={mockLike} handleRemove={mockRemove} />
      </TestRouter>
    ).container
    const user = userEvent.setup()

    const myBlog = container.querySelector('.details')
    const author = screen.getByTestId('author_det')
    const title = screen.getByTestId('title_det')
    const url = screen.getByTestId('url')
    const likes = screen.getByTestId('likes')
    // console.log(myBlog.innerHTML)
    console.log(author.innerHTML, title.innerHTML, url.innerHTML, likes.innerHTML)
    expect(myBlog).toHaveTextContent('A blog for a test')
    expect(myBlog).toHaveTextContent('TesterMan')
    expect(myBlog).toHaveTextContent('www.testablog.com')
    expect(myBlog).toHaveTextContent('1738')
    expect(author).toBeVisible()
    expect(title).toBeVisible()
    expect(url).toBeVisible()
    expect(likes).toBeVisible()

    const likeButton = screen.getByText('like')
    expect(likeButton).toBeDefined()
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockLike.mock.calls).toHaveLength(2)
    expect(mockLike).toHaveBeenCalledWith(blog)

    const removeButton = screen.getByText('remove')
    expect(removeButton).toBeDefined()
    await user.click(removeButton)
    expect(mockRemove.mock.calls).toHaveLength(1)
    expect(mockRemove).toHaveBeenCalledWith(blog.id)

  })
})