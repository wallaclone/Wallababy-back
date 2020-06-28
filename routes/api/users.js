'use strict';

const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { body, validationResult } = require('express-validator');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET a specific user by Id*/
router.get('/:id', async function(req, res, next) {
  try {
    const _id = req.params.id;

    const user = await User.findById({_id});
    if (!user){
      const error = new Error('not found');
      error.status = 404;
      return next(error);
    }
    res.json({ result: user })
  } catch (error) { next(error) }
})

/* User Creation */
router.post('/', [
  body('username').isLength({ min: 5 }).withMessage('The username must have more than 5 characters'),
  body('email').isEmail(),
  body('password').isString().withMessage('Cant be empty')
], async function(req, res, next) {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let user = "";
    
    const username = req.body.username;
    user = await User.findOne({ username });

    if (user) {
      res.status(400).json('The username is in use');
      return;
    }

    const email = req.body.email;
    user = await User.findOne({ email });
    if (user) {
      res.status(400).json('The email is in use');
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
