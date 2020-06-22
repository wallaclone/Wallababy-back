'use strict';

const express = require('express');
const router = express.Router();
const User = require('../../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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

router.post('/forgotpassword', async function(req, res, next) {
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

module.exports = router;
