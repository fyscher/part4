const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
})
  
blogSchema.set('toJSON',
{
  transform: (document, returnedObj) =>
  {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})
  
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
  