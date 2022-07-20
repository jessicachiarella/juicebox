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
    console.log(req.params, "These are my req.params!!!")
    const { tagName } = req.params;
    try {
        const posts = await getPostsByTagName(tagName);
        res.send({ posts: [ posts ] })
    } catch ({ name, message }) {
        next({ name, message });
    }

});

module.exports = tagsRouter;