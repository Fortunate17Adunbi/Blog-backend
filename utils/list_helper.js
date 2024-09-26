const dummy  = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0 
    ? 0
    : blogs.reduce((sum, blog) => {
      return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0 ) {
    return 0
  } else {
    // return blogs.reduce((sum, blog) => {
    //   if (blog.likes > blogtemp.likes) {
    //     Object.assign(blogtemp, { title: blog.title, author: blog.author, likes: blog.likes });
    //     return blogtemp
    //   }
    //   return blogtemp
    // }, {}) 
    return blogs.reduce((sum, blog) => {
      if (blog.likes > sum.likes) {
        Object.assign(sum, { title: blog.title, author: blog.author, likes: blog.likes });
        sum
      }
      return sum
    }, { title: "", author: "", likes: 0 }) 
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}