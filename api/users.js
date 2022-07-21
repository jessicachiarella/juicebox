const express = require('express');
const jwt = require('jsonwebtoken');
const { restart } = require('nodemon');
const usersRouter = express.Router();
const { getAllUsers, getUserByUsername, createUser, getUserById, updateUser } = require('../db');
const { requireUser } = require('./utils');

usersRouter.get('/', async (req, res) => {

    const users = await getAllUsers();

    res.send({
        users
    });
});

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }
  
    try {
      const user = await getUserByUsername(username);

      if (user && user.password == password) {
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
      next(error);
    }
  });

  usersRouter.post('/register', async (req, res, next) => {
    const { username, password, name, location} = req.body;
  
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

  usersRouter.delete('/:userId', requireUser, async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await getUserById(userId);
      console.log(user)
      if(user.active && (user.id === userId)) {
        const updatedUser = updateUser(userId, { active: false })
        
        res.send({ user: updatedUser })
      } else {
        next(user.active ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a user which is not yours."
        } : {
          name: "UserAlreadyDeleted",
          message: "That user has already been deleted."
        });
      }

  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });

  usersRouter.patch('/:userId', requireUser, async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await getUserById(userId);
      if(!user.active && (user.id === userId)) {
        const updatedUser = updateUser(userId, { active: true })
        
        res.send({ user: updatedUser })
      } else {
        next(!user.active ? { 
          name: "UnauthorizedUserError",
          message: "You cannot update a user which is not yours."
        } : {
          name: "UserAlreadyActivated",
          message: "That user has already been activated."
        });
      }

  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });

module.exports = usersRouter;