'use strict';

const router = require('express').Router();
const Advert = require('../../models/Advertisement');
const User = require('../../models/User');
const upload = require('../../lib/multerConfig');

router.get('/', async function(req, res, next) {
  const limit = parseInt(req.query.limit) || 1000;
  const sort = req.query.sort || 'date_creation';

  const adverts = await Advert.list(limit, sort);
  res.status(201).json(adverts);
});

router.post('/', upload.single('image'), async function(req, res, next) {
  try {
    const advert = new Advert(req.body);
    const userId = req.userId;
    const user = await User.findById(userId);

    advert.owner = user.username;
    advert.date_creation = Date.now();
    await advert.setFoto(req.file);

    const saved = await advert.save();
    res.status(201).json(saved);
  } catch (error) { next(error) }
});

router.get('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    const advert = await Advert.findOne({_id});
    if (!advert){
      const error = new Error('not found');
      error.status = 404;
      return next(error);
    }
    res.json({ result: advert })
  } catch (error) {
    next(error);
  }
})

router.put('/:id', upload.single('image'), async function(req, res, next) {
  try {
    const _id = req.params.id;
    const advert = req.body;
    advert.image = req.file.filename;
    const savedAdvert = await Advert.findOneAndUpdate({ _id }, advert, {
      new: true,
      useFindAndModify: false,
    });
    res.json({
      result: savedAdvert,
      message: 'Advert updated correctly'
    });
  } catch (error) { next(error) }  
});

router.delete('/:id', async(req, res, next) => {
  try {
    const _id = req.params.id;

    await Advert.deleteOne({ _id });
    res.json({ message: 'The advert has been removed correctly' });
  } catch (error) { next(error) }
})

module.exports = router;
