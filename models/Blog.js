import mongoose from 'mongoose';
const Scheme = mongoose.Schema;

const blogSchema = new Scheme({
    title: {
        type: String,
        required: true
    }, 
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true });

// The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name. Thus, Blog model look for blogs collection.
const Blog = mongoose.model('Blog', blogSchema);

export default Blog;