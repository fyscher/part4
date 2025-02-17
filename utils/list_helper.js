const lodash = require('lodash');

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

const favouriteAuthor = blogs =>
{
    const groups = lodash.groupBy(blogs, 'author')
    const mapped = lodash.mapValues(groups, value => value.length)
    const entries = Object.entries(mapped)
    const fave = entries.reduce((max, current) =>
    {
        return (current[1] > max[1])
        ? current
        : max
    })
    console.log(
        {
            author: fave[0],
            blogs: fave[1]
        }
    )
    return {
        author: fave[0],
        blogs: fave[1]
    }

}

const mostLikes = blogs =>
{
    const groups = lodash.groupBy(blogs, 'author')
    const mapped = lodash.mapValues(groups, value =>
    {
        const result = value.reduce(( total, current ) =>
        {
            return total + current.likes
        }, 0)
        return result
    })
    const entries = Object.entries(mapped)
    const fave = entries.reduce((max, current) =>
    {
        return (current[1] > max[1])
        ? current
        : max
    })
    console.log(
        {
            author: fave[0],
            likes: fave[1]
        }
    )
    return {
        author: fave[0],
        likes: fave[1]
    }
}

module.exports = 
{
    dummy,
    totalLikes,
    favouriteBlog,
    favouriteAuthor,
    mostLikes
}