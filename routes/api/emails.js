const express = require('express');

const router = express.Router();

const User = require('../../models/User');
const Advertisement = require('../../models/Advertisement');

router.get('/', async (req, res, next) => {
  try {
    const owner = req.query.owner;
    const user = await User.findOne({username: owner})
    console.log(user)
    res.status(201).json({
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const owner = req.query.owner;
    const user = await User.findOne({username: owner})
    const sender = req.body.sender;
    const id = req.body.id
    const user2 = await User.findOne({username: sender})
    const adId = await Advertisement.findOne({ _id: id})

  
    const email = user.email;
    const language = req.body.language;

    if (language === 'es-ES') {
      await User.contactUserES(email, sender, adId);
      res.status(201).json('Email sent');
    } else {
      await User.contactUser(email, sender, adId);;
      res.status(201).json('Email sent!');
    }
    
  } catch (error) {
    next(error);
  }
}); 

module.exports = router;
