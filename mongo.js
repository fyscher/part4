const mongoose = require('mongoose')
const config = require('./utils/config');
const logger = require('./utils/logger')

const url = config.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose
    .connect(url)
    .then(() => 
    {
        const blogSchema = new mongoose.Schema(
        {
            title: String,
            author: String,
            url: String,
            likes: Number,
        })

        const Blog = mongoose.model('Blog', blogSchema)

        const blog = new Blog(
        {
            title: 'HTML is too Easy',
            author: 'FB Red',
            url: 'www.420.com',
            likes: 6969,
        })

        blog.save().then(result =>
        {
            console.log('blog saved!')
            logger.info(result)
        })

        Blog.find({}).then(result =>
        {
            result.forEach(blog =>
            {
                console.log(blog)
            })
            mongoose.connection.close()
        })
    
})
