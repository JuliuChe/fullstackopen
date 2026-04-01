const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')


const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const severalBlogs = [
  {
    title: 'First blog',
    author: 'Me',
    url: 'http://localhost:me',
    likes: 4,
    id: '69b401fd7255e1a48d5e4bae'
  },
  {
    title: 'Second blog',
    author: 'Me2',
    url: 'http://localhost:me2',
    likes: 2,
    id: '69b406a762247ab7ae42cd4c'
  },
  {
    title: 'Third blog',
    author: 'Me3',
    url: 'http://localhost:me3',
    likes: 33,
    id: '69b406cb48f05033492e1cac'
  },
  {
    title: 'Fourth blog',
    author: 'Me4',
    url: 'http://localhost:me4',
    likes: 444,
    id: '69b4083fb0c2d5046abcc534'
  },
  {
    title: 'Fourth blog',
    author: 'Me4',
    url: 'http://localhost:me4',
    likes: 444,
    id: '69b40a1c7a2f28dedbd47d29'
  },
  {
    title: 'Flat beaat blog',
    author: 'Mr.Oizooo',
    url: 'http://localhost:meesterOizo',
    likes: 485125754,
    id: '69c54026a653e2c0349120d6'
  }
]

const equalLikesBlogs = [
  {
    title: 'Third blog',
    author: 'Me3',
    url: 'http://localhost:me3',
    likes: 33,
    id: '69b406cb48f05033492e1cac'
  },
  {
    title: 'Fourth blog',
    author: 'Me4',
    url: 'http://localhost:me4',
    likes: 444,
    id: '69b4083fb0c2d5046abcc534'
  },
  {
    title: 'Fourth blog',
    author: 'Me4',
    url: 'http://localhost:me4',
    likes: 444,
    id: '69b40a1c7a2f28dedbd47d29'
  }
]

const noBlogs = []

const blogsFullStack = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has more than one blog', () => {
    const result = listHelper.totalLikes(severalBlogs)
    assert.strictEqual(result, 485126681)
  })

  test('when list has no blogs', () => {
    const result = listHelper.totalLikes(noBlogs)
    assert.strictEqual(result, 0)
  })
})


describe('favorite blog likes', () => {

  test('when list has only one blog, blog return is the only blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result,
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      })
  })

  test('when list has more than one blog', () => {
    const result = listHelper.favoriteBlog(severalBlogs)
    assert.deepStrictEqual(result,
      {
        title: 'Flat beaat blog',
        author: 'Mr.Oizooo',
        url: 'http://localhost:meesterOizo',
        likes: 485125754,
        id: '69c54026a653e2c0349120d6'
      })
  })

  test('when several blogs have same amount of likes, returns the first one', () => {
    const result = listHelper.favoriteBlog(equalLikesBlogs)
    assert.deepStrictEqual(result,
      {
        title: 'Fourth blog',
        author: 'Me4',
        url: 'http://localhost:me4',
        likes: 444,
        id: '69b4083fb0c2d5046abcc534'
      })
  })

  test('when list has no blogs', () => {
    const result = listHelper.favoriteBlog(noBlogs)
    assert.deepStrictEqual(result, {})
  })
})

describe('Author with most blogs referenced', () => {
  test('test with a list containing several times the same author', () => {
    const result = listHelper.mostBlogs(blogsFullStack)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })

  test('test with a list containing one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  test('when list has no blogs', () => {
    const result = listHelper.mostBlogs(noBlogs)
    assert.deepStrictEqual(result, {})
  })

  test('when list hasseveral blogs v2', () => {
    const result = listHelper.mostBlogs(severalBlogs)
    assert.deepStrictEqual(result, { author: 'Me4', blogs:2 })
  })

  test('when list hasseveral blogs v3', () => {
    const result = listHelper.mostBlogs(equalLikesBlogs)
    assert.deepStrictEqual(result, { author: 'Me4', blogs:2 })
  })
})


describe('Author with most likes accross all his blogs', () => {
  test('test with a list containing several times the same author', () => {
    const result = listHelper.mostLikes(blogsFullStack)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 })
  })

  test('test with a list containing one blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 5 })
  })

  test('when list has no blogs', () => {
    const result = listHelper.mostLikes(noBlogs)
    assert.deepStrictEqual(result, {})
  })

  test('when list hasseveral blogs v2', () => {
    const result = listHelper.mostLikes(severalBlogs)
    assert.deepStrictEqual(result, { author: 'Mr.Oizooo', likes:485125754 })
  })

  test('when list hasseveral blogs v3', () => {
    const result = listHelper.mostLikes(equalLikesBlogs)
    assert.deepStrictEqual(result, { author: 'Me4', likes:888 })
  })
})