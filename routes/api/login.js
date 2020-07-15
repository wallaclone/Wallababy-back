const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

router.post('/', async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(400).json('Invalid credentials');
      return;
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2d',
    });

    res.cookie('token', token);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
