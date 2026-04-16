import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let container
let mockLike

describe('<Blog />', () => {
  beforeEach( () => {
    const blog = {
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
    const mockRemove = vi.fn()

    container = render(
      <Blog blog={blog} handleLike={mockLike} handleRemove={mockRemove} />
    ).container
  })

  test('renders a blog with author and title', () => {
    const blog = container.querySelector('.highlights')
    const author = container.querySelector('#author_base')
    const title = container.querySelector('#title_base')
    const url = container.querySelector('#url')
    const likes = container.querySelector('#likes')
    expect(blog).toHaveTextContent('A blog for a test')
    expect(blog).toHaveTextContent('TesterMan')
    expect(author).toBeVisible()
    expect(title).toBeVisible()
    expect(blog).not.toHaveTextContent('www.testablog.com')
    expect(blog).not.toHaveTextContent('1738')
    expect(url).not.toBeVisible()
    expect(likes).not.toBeVisible()
  })

  test('renders a blog\'s url and number of likes when view button clicked', async () => {


    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const blog = container.querySelector('.details')
    const author = container.querySelector('#author_det')
    const title = container.querySelector('#title_det')
    const url = container.querySelector('#url')
    const likes = container.querySelector('#likes')
    console.log(blog.innerHTML)
    console.log(author.innerHTML, title.innerHTML, url.innerHTML, likes.innerHTML)
    expect(blog).toHaveTextContent('A blog for a test')
    expect(blog).toHaveTextContent('TesterMan')
    expect(blog).toHaveTextContent('www.testablog.com')
    expect(blog).toHaveTextContent('1738')
    expect(author).toBeVisible()
    expect(title).toBeVisible()
    expect(url).toBeVisible()
    expect(likes).toBeVisible()
  })

  test('Checks that two clicks on a like calls its handece', async () => {


    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockLike.mock.calls).toHaveLength(2)
  })
})