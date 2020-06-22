'use strict';

const express = require('express');
const router = express.Router();
const User = require('../../models/User');

router.post('/', async function(req, res, next) {
  try {
    const email = req.body.email;

    const response = await User.recoverPassword(email);
    res.status(201).send(`email enviado correctamente ${response}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
