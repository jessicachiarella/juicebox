const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');


tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params;
    try {
        
        const posts = await getPostsByTagName(tagName);
        const filteredPosts = posts.filter(post => {
            return (post.active && post.author.active) || (req.user && post.author.id === req.user.id)
        })

        res.send(filteredPosts)
    } catch ({ name, message }) {
        next({ name, message });
    }

});

module.exports = tagsRouter;