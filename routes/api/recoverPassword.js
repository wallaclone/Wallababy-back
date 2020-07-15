const express = require('express');

const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');
const jwtAuth = require('../../lib/jwtAuth');

/* Send email to the specified email */
router.post('/', [
  body('email').isEmail(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const email = req.body.email;
    const language = req.body.language;

    if (language === 'es-ES') {
      await User.recoverPasswordEs(email);
      res.status(201).json('Email sent');
    } else {
      await User.recoverPassword(email);
      res.status(201).json('Email sent');
    }
  } catch (error) {
    next(error);
  }
});

/*
 Endpoint to change user password after recoverpassword request,
 Endpoint is: http://localhost:3000/recoverpassword/forgotpassword/:userId
*/
router.post('/forgotpassword/:id', jwtAuth(), async (req, res, next) => {
  try {
    const newPassword = req.body.password;
    if (!newPassword) {
      return res.status(400).json('Password cant be empty');
    }
    const userId = req.params.id;

    const user = User.findById(userId);
    if (!user) {
      res.status(401).json('User not found');
      return;
    }
    await user.update({ password: User.hashPassword(newPassword) });
    res.status(201).json('Password updated correctly');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
