import Blog from '../models/Blog.js';
import Reactblog from '../models/Reactblog.js'

const getCreateBlog = (req, res) => {
  res.render('blogs/create', { title: 'Create' });
};

const getAllBlogs = (req, res) => {
  Blog.find().sort( { createdAt: -1 } ) // sort by newest
    .then( result => res.render( 'blogs/index', { title: 'All Blogs', blogs: result } ))
    .catch( err => console.log(err) );
};

const getBlog = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then( result => res.render( 'blogs/details', { title: 'Blog Details', blog: result }))
    .catch( err => res.status(404).render('404', { title: '404' }));
};

const postBlog = (req, res) => {
  const blog = new Blog(req.body);
  blog.save()
    .then( result => res.redirect('/'))
    .catch( err => console.log(err) );
};

const deleteBlog = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then( result => res.json({ redirect: '/' }))
    .catch( err => console.log(err) );
};


// React Blog
const saveReactBlogs = (req, res) => {
  const reactblog = new Reactblog(req.body);
  reactblog.save()
    .then( result => res.send("hello"))
    .catch( err => console.log(err));
};

const displayReactBlogs = (req, res) => {
  Reactblog.find().sort( { createdAt: 0 } )
    .then( result => res.send(result))
    .catch( err => console.log(err));
};
 


export {
  getCreateBlog,
  getAllBlogs,
  getBlog,
  postBlog,
  deleteBlog,
  displayReactBlogs,
  saveReactBlogs
};