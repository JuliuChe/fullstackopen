const lodash = require('lodash')

const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sumLikes, blog) => {
    return sumLikes+blog.likes
  },0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {}
  return blogs.reduce( (mostLikes, blog) => {
    return blog.likes>mostLikes.likes?blog:mostLikes
  })
}

const mostBlogs = (blogs) => {
  const result = lodash.reduce(lodash.countBy(blogs,'author'), (mostBlog, count, author) =>
  {
    return count>mostBlog.blogs?{ author, blogs:count }:mostBlog
  }, { author:null, blogs:0 }
  )
  return result.author?result:{}
}

const mostLikes = (blogs) => {
  const result =  lodash.reduce(blogs, (acc, blog) => {

    acc.likes[blog.author]=(acc.likes[blog.author] || 0)+blog.likes

    if (acc.likes[blog.author]>acc.max.likes){
      acc.max = { author : blog.author, likes:acc.likes[blog.author] }
    }

    return acc
  },
  { likes:{} , max:{ author:null, likes : 0 }
  })
  return result.max.author?result.max:{}
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes   }