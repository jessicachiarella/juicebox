// curl http://localhost:3000/api/posts -X POST -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJwYXNzd29yZCI6ImJlcnRpZTk5IiwibmFtZSI6Ik5ld25hbWUgU29nb29kIiwibG9jYXRpb24iOiJMZXN0ZXJ2aWxsZSwgS1kiLCJhY3RpdmUiOnRydWUsImlhdCI6MTY1ODMyODAxOX0.LHKp-g0LMxpuoeZrwpM2pcdR_w1IArWqDk49dqoVatk'

const express = require('express');
const postsRouter = express.Router();
const { getAllPosts, createPost, updatePost, getPostById } = require('../db');
const { requireUser } = require('./utils');


postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;
    console.log(req, "THIS IS REQ")
    
    const tagArr = tags.trim().split(/\s+/)
    const postData = {};
  
    // only send the tags if there are some to send
    if (tagArr.length) {
      postData.tags = tagArr;
    }
    try {
        postData.title = title
        postData.content = content
        postData.authorId = req.user.id
        const post = await createPost(postData);
        if (post) {
            res.send({ post })
        } else {
            next({
                name: "MissingPostError",
                message: "Post Didn't Come Back",
              })
        }
    }
    catch ({ name, message }) {
    next({ name, message });
  }
  });


postsRouter.get('/', async (req, res) => {
    try {
 const posts = await getAllPosts();

 res.send({
     posts
 });
    
   } catch (error) {
    console.log("post router get error!!")
   }   
});

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;
  
    const updateFields = {};
  
    if (tags && tags.length > 0) {
      updateFields.tags = tags.trim().split(/\s+/);
    }
  
    if (title) {
      updateFields.title = title;
    }
  
    if (content) {
      updateFields.content = content;
    }
  
    try {
      const originalPost = await getPostById(postId);
  
      if (originalPost.author.id === req.user.id) {
        const updatedPost = await updatePost(postId, updateFields);
        res.send({ post: updatedPost })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a post that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try {
      const post = await getPostById(req.params.postId);
  
      if (post && post.author.id === req.user.id) {
        const updatedPost = await updatePost(post.id, { active: false });
  
        res.send({ post: updatedPost });
      } else {
        next(post ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a post which is not yours"
        } : {
          name: "PostNotFoundError",
          message: "That post does not exist"
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });


module.exports = postsRouter;