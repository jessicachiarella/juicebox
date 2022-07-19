// npm i jsonwebtoken
// npm i dotenv

require('dotenv').config();

console.log(process.env.JWT_SECRET)

const PORT = 3000;
const express = require('express');
const server = express();
const apiRouter = require('./api');
const apiPosts = require('./api/posts.js');
const apiTags = require('./api/tags.js');
const morgan = require('morgan');

server.use(morgan('dev'));
server.use(express.json());
server.use('/api', apiRouter);
server.use('/api/posts', apiPosts);
server.use('/api/tags', apiTags);

const { client } = require('./db');
const usersRouter = require('./api/users');
server.use('/api/users', usersRouter);
client.connect();

server.listen(PORT, () => {
    console.log('The server is open on port', PORT)
})


server.use((req, res, next) => {
    console.log('<____Body Logger START____>');
    console.log(req.body);
    console.log('<____Body Logger END____>');

    next();
})

server.post('/api/users/register', () => {});
server.post('/api/users/login', () => {});
server.delete('/api/users/:id', () => {});