const express = require('express');
const jwt = require('jsonwebtoken')
const usersRouter = express.Router();
const { getAllUsers, getUserByUsername, createUser } = require('../db');

// curl http://localhost:3000/api/users/login -H "Content-Type: application/json" -X POST -d '{"username": "albert", "password": "bertie99"}' 

// curl http://localhost:3000/api -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJwYXNzd29yZCI6ImJlcnRpZTk5IiwibmFtZSI6Ik5ld25hbWUgU29nb29kIiwibG9jYXRpb24iOiJMZXN0ZXJ2aWxsZSwgS1kiLCJhY3RpdmUiOnRydWUsImlhdCI6MTY1ODI1Njk4OH0.H5d4P8MGgVS8M81wR7eemxIe3dje-SsqPJ4TNG7wtSc'

usersRouter.get('/', async (req, res) => {

    const users = await getAllUsers();

    res.send({
        users
    });
});

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    // request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }
  
    try {
      const user = await getUserByUsername(username);
      if (user && user.password == password) {
        // create token & return to user
        const { JWT_SECRET } = process.env
        const token = jwt.sign(user, JWT_SECRET)
        res.send({ message: "you're logged in!", token: `${token}` });
      } else {
        next({ 
          name: 'IncorrectCredentialsError', 
          message: 'Username or password is incorrect'
        });
      }
    } catch(error) {
      console.log(error);
      next(error);
    }
  });

  usersRouter.post('/register', async (req, res, next) => {
    const { username, password, name, location } = req.body;
  
    try {
      const _user = await getUserByUsername(username);
  
      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      }
  
      const user = await createUser({
        username,
        password,
        name,
        location,
      });
  
      const token = jwt.sign({ 
        id: user.id, 
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });
  
      res.send({ 
        message: "thank you for signing up",
        token 
      });
    } catch ({ name, message }) {
      next({ name, message })
    } 
  });

module.exports = usersRouter;