'use strict';

const express = require('express');
const router = express.Router();
const User = require('../../models/User');

/* Send email to the specified email*/
router.post('/', async function(req, res, next) {
  try {
    const email = req.body.email;

    await User.recoverPassword(email);
    res.status(201).send('email enviado correctamente');
  } catch (error) {
    next(error);
  }
});

/*
 Endpoint to change user password before recoverpassword request,
 Enpoint is: http://localhost:3000/recoverpassword/forgotpassword
*/
router.post('/forgotpassword:id', async function(req, res, next) {
  try {
    const newPassword = req.body.newPassword;
    const userId = req.query.id;

    const user = User.findById(userId);
    if (!user) {
      res.status(401).json('User not found');
      return;
    }
    user.update({ password: newPassword});
    res.status(201).send('Password updated correctly');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
