const dummy = blogs =>
{
    return 1
}

const totalLikes = blogs =>
{
    const reducer = (arr, blog) =>
    {
        return arr + blog.likes 
    }
    
    return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favouriteBlog = blogs =>
{
    const fave =  blogs.reduce((max, current) =>
    {
       return (current.likes > max.likes)
       ? current
       : max
    })
    return blogs === 0
    ? 0
    : {
        title: fave.title,
        author: fave.author,
        likes: fave.likes
    }
}

module.exports = 
{
    dummy,
    totalLikes,
    favouriteBlog
}