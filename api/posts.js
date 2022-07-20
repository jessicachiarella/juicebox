const express = require('express');
const postsRouter = express.Router();
const { getAllPosts, createPost } = require('../db');
const { requireUser } = require('./utils');

postsRouter.post('/', requireUser, async (req, res, next) => {
    console.log("did i run??")
    try {
        res.send({ message: 'under construction' });
        
    } catch (error) {
        console.log("Here's the error we're looking for")
    }
  });


// curl http://localhost:3000/api/posts -X POST -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJwYXNzd29yZCI6ImJlcnRpZTk5IiwibmFtZSI6Ik5ld25hbWUgU29nb29kIiwibG9jYXRpb24iOiJMZXN0ZXJ2aWxsZSwgS1kiLCJhY3RpdmUiOnRydWUsImlhdCI6MTY1ODMyODAxOX0.LHKp-g0LMxpuoeZrwpM2pcdR_w1IArWqDk49dqoVatk'

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

module.exports = postsRouter;