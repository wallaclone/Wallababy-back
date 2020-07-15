const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectID;

const User = require('../../models/User');

router.get('/', async (req, res, next) => {
  try {
    const token = req.query.token || req.get('Authorization');
    if (!token) {
      const error = new Error('No user logged');
      next(error);
      return;
    }
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;
    const user = await User.findOne({ _id: ObjectId(userId) });
    res.status(201).json({
      user: user.username,
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
