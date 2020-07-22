const router = require('express').Router();

const ObjectId = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');


const Advert = require('../../../models/Advertisement');
const User = require('../../../models/User');
const Chat = require('../../../models/Chats');


// get users chat list 

router.get('/', async function (req, res, next) {
  try {
    const sender = await User.findOne({ _id: ObjectId(req.userId) });
    const owner = await User.findOne({_id: ObjectId(req.userId)})
    const chatList = await Chat.find(
      { 
        $or : [ 
                {owner : owner.username},
                {sender : sender.username}
              ]
      });
    return res.status(200).json({ chats: chatList });
  } catch (error) {
    next(error);
  }
}
);

// get chat detail

router.get('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    const chat = await Advert.findOne({ _id });
    if (!chat) {
      const error = new Error('not found');
      error.status = 404;
      return next(error);
    }
    res.json({ result: chat });
  } catch (error) { next(error); }
});

// create new chat

router.post('/', async (req, res, next) => {
  try {

    const chat = new Chat(req.body);
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(403).json('You have to be logged to create a chat');
      return;
    }
    chat.sender = user.username;

    const saved = await chat.save();
    const addChat = await Chat.findOneAndUpdate({ owner: req.body.owner },
      { $push: { chat: saved } })
    res.status(201).json({ 'New chat': saved, addChat });
  } catch (error) { next(error); }
});



module.exports = router;