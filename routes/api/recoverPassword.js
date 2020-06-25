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
router.post('/forgotpassword', async function(req, res, next) {
  try {
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log("la url es: ",url);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
