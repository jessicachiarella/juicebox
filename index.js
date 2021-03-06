require('dotenv').config();

const PORT = 3000;
const express = require('express');
const server = express();
const apiRouter = require('./api');
const morgan = require('morgan');
const { client } = require('./db');


server.use(morgan('dev'));
server.use(express.json());

client.connect();

server.use((req, res, next) => {
    console.log('<____Body Logger START____>');
    console.log(req.body);
    console.log('<____Body Logger END____>');

    next();
})

server.use("/api", apiRouter)


server.use((error, req, res, next) => {
    res.send({
      name: error.name,
      message: error.message
    });
  });

  server.listen(PORT, () => {
    console.log('The server is open on port', PORT)
})