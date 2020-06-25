'use strict';

const express = require('express');
const router = express.Router();
const User = require('../../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* User Creation */
router.post('/', async function(req, res, next) {
  try {
    let user = "";
    
    const username = req.body.username;
    user = await User.findOne({ username });

    if (user) {
      const error = new Error('Username already in use');
      next(error);
      return;
    }

    const email = req.body.email;
    user = await User.findOne({ email });
    if (user) {
      const error = new Error('Email already in use');
      next(error);
      return;
    }

    const password = req.body.password;
    const userData = {
      username,
      email,
      password: await User.hashPassword(password)
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    res.status(201).json(({ result: savedUser}));
  } catch (error) {
    next(error);
  }
});

/* Edit the user specifying the id */
router.put('/:id', async function(req, res, next) {
  try {
    const userId = req.params.id;
    const userData = req.body;

    await User.findByIdAndUpdate(userId, {
      username: userData.username,
      email: userData.email,
      password: User.hashPassword(userData.password)
    });
    res.status(201).json('The user has been updated correctly');
  } catch (error) { next(error) }
})

/* Remove user from database specifying id */
router.delete('/:id', async function(req, res, next) {
  try {
    const userId = req.params.id;

    await User.findByIdAndDelete(userId);
    res.status(201).json('The user has been removed correctly');
  } catch (error) { next(error) }
})

module.exports = router;
