'use strict';

const router = require('express').Router();
const Advert = require('../../models/Advertisement');
const User = require('../../models/User');
const jwtAuth = require('../../lib/jwtAuth');

const upload = require('../../lib/multerConfig');
const { body, validationResult } = require('express-validator');

/* Show ad list and filters. Public & private*/

router.get('/', async function (req, res, next) {
  const limit = parseInt(req.query.limit) || 1000;
  const sort = req.query.sort || 'date_creation';
  const name = req.query.name;
  const tags = req.query.tags;
  const toSell = req.query.venta;
  const price = req.query.price;
  const owner = req.query.owner;
  const filters = {};

  if (typeof name !== 'undefined') {
    filters.name = new RegExp(nombre, 'i');
  }

  if (typeof tags !== 'undefined') {
    filters.tags = tags;
  }

  if (typeof toSell !== 'undefined') {
    filters.toSell = toSell;
  }

  if (typeof price !== 'undefined' && price !== '-') {
    if (price.indexOf('-') !== -1) {
      filters.price = {}
      let rango = price.split('-')
      if (rango[0] !== '') {
        filters.price.$gte = rango[0]
      }

      if (rango[1] !== '') {
        filters.price.$lte = rango[1]
      }
    } else {
      filters.price = price
    }
  }

  if (typeof name !== 'undefined') {
    filters.name = name;
  }

  if (typeof owner !== 'undefined') {
    filters.owner = owner
  }

  const adverts = await Advert.list(filters, limit, sort);
  res.status(201).json(adverts);
});

/* Create new ad. Private */
router.post('/', jwtAuth(), upload.single('image'), [
  body('name').isString().withMessage('Name cant be empty'),
  body('price').isNumeric().withMessage('Price can only contain numbers'),
  body('status').isBoolean().withMessage('Status cant be empty'),
], async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const advert = new Advert(req.body);
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(403).json('You have to be logged to create an advert');
      return;
    }
    advert.owner = user.username;
    advert.date_creation = Date.now();
    await advert.setFoto(req.file);

    const saved = await advert.save();
    res.status(201).json({ 'new ad details': saved, 'id': saved._id });
  } catch (error) { next(error) }
});

/* See ad detail. Public & private */
router.get('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    const advert = await Advert.findOne({ _id });
    if (!advert) {
      const error = new Error('not found');
      error.status = 404;
      return next(error);
    }
    res.json({ result: advert })
  } catch (error) { next(error) }
})

/* Edit ad. Private */

router.put('/:id', jwtAuth(), upload.single('image'), async function (req, res, next) {
  try {
    const _id = req.params.id;
    const advert = req.body;
    if (typeof advert.image !== 'string'){
      advert.image = req.file.filename;
    }
    await Advert.findOneAndUpdate({ _id }, advert, {
      new: true,
      useFindAndModify: false,
    });
    res.json({
      message: 'Advert updated correctly'
    });
  } catch (error) { next(error) }
});

/* Delete ad. Private */

router.delete('/:id', jwtAuth(), async (req, res, next) => {
  try {
    const _id = req.params.id;

    await Advert.deleteOne({ _id });
    res.json({ message: 'The advert has been removed correctly' });
  } catch (error) { next(error) }
}) 

module.exports = router;
