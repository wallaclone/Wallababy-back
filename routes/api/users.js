const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');
const Adverts = require('../../models/Advertisement');
const jwtAuth = require('../../lib/jwtAuth');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* GET a specific user by Id */
router.get('/:filter', async (req, res, next) => {
  try {
    const _id = req.params.filter;
    const username = req.params.filter;
    const userByName = await User.findOne({ username });

    if (userByName) {
      return res.json({ result: userByName });
    }
    const userById = await User.findById({ _id });
    if (!userById && !userByName) {
      const error = new Error('not found');
      error.status = 404;
      return next(error);
    }

    res.json({ result: userById });
  } catch (error) { next(error); }
});

/* User Creation */
router.post('/', [
  body('username').isLength({ min: 1 }).withMessage('The username must have more than 5 characters'),
  body('email').isEmail(),
  body('password').isString().withMessage('Cant be empty'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let user = '';

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
      password: await User.hashPassword(password),
    };

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    res.status(201).json(({ result: savedUser }));
  } catch (error) {
    next(error);
  }
});

/* Edit the user specifying the id. Private */
router.put('/:id', jwtAuth(), async (req, res, next) => {
  try {
    const userData = req.body;
    const token = req.query.token || req.header('Authorization');
    const userNameInDb = await User.findOne({ username: userData.username });
    const userEmailInDb = await User.findOne({ email: userData.email });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decodedUser = await User.findOne({ _id: decoded._id });

    if (userNameInDb) {
      if (JSON.stringify(decodedUser._id) !== JSON.stringify(userNameInDb._id)) {
        return res.status(400).json('The username already exists');
      }
    }

    if (userEmailInDb) {
      if (decodedUser.email !== userEmailInDb.email) {
        return res.status(400).json('The email already exists');
      }
    }

    await Adverts.find({ owner: decodedUser.username }).updateMany({ owner: userData.username });
    await User.findByIdAndUpdate(decodedUser._id, {
      username: userData.username,
      email: userData.email,
      password: User.hashPassword(userData.password),
    });

    res.status(201).json({ message: 'The user has been updated correctly' });
  } catch (error) { next(error); }
});

/* Remove user from database specifying id */
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    await User.findByIdAndDelete(userId);
    await Adverts.find({ owner: user.username }).deleteMany();
    res.status(201).json('The user has been removed correctly');
  } catch (error) { next(error); }
});

module.exports = router;
