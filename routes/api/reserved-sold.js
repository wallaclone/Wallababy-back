const router = require('express').Router();
const Advert = require('../../models/Advertisement');
const User = require('../../models/User');

/* Mark ad as sold */

router.post('/sold/:id', async (req, res, next) => {
  const _id = req.params.id;

  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const username = user.username;
    const ad = await Advert.findById({ _id });
    const owner =  ad.owner;

    if (username === owner) {
      const adUpdated = await Advert.findByIdAndUpdate(
        ad._id,
        { $set: { sold: true } },
        { new: true },
      );
      return res.json({ message: 'Ad marked as sold', adUpdated });
    }

    return res.status(400).json({ message: 'User does not own this ad' });
  } catch (error) {
    console.log('Error chanching ad status', error);
    return res.status(500).json({ message: 'Error changing ad status' });
  }
});

/* Mark ad as not sold */

router.post('/notsold/:id', async (req, res, next) => {
  const _id = req.params.id;

  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const { username } = user;

    const ad = await Advert.findById({ _id })
    const owner =  ad.owner;

    if (username === owner) {
      const adUpdated = await Advert.findByIdAndUpdate(
        ad._id,
        { $set: { sold: false } },
        { new: true },
      );
      return res.json({ message: 'Ad marked as not sold', adUpdated });
    }

    return res.status(400).json({ message: 'User does not own this ad' });
  } catch (error) {
    console.log('Error chanching ad status', error);
    return res.status(500).json({ message: 'Error changing ad status' });
  }
});

/* Mark ad as reserved */

router.post('/reserved/:id', async (req, res, next) => {
  const _id = req.params.id;

  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const username = user.username;
    const ad = await Advert.findById({ _id })
    const owner =  ad.owner;

    if (username === owner) {
      const adUpdated = await Advert.findByIdAndUpdate(
        ad._id,
        { $set: { reserved: true } },
        { new: true },
      );
      return res.json({ message: 'Ad marked as sold', adUpdated });
    }

    return res.status(400).json({ message: 'User does not own this ad' });
  } catch (error) {
    console.log('Error changing ad status', error);
    return res.status(500).json({ message: 'Error changing ad status' });
  }
});

/* Mark ad as not reserved */

router.post('/unreserved/:id', async (req, res, next) => {
  const _id = req.params.id;

  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const username = user.username;

    const ad = await Advert.findById({ _id })
    const owner =  ad.owner;

    if (username === owner) {
      const adUpdated = await Advert.findByIdAndUpdate(
        ad._id,
        { $set: { reserved: false } },
        { new: true },
      );
      return res.json({ message: 'Ad marked as not reserved', adUpdated });
    }

    return res.status(400).json({ message: 'User does not own this ad' });
  } catch (error) {
    console.log('Error changing ad status', error);
    return res.status(500).json({ message: 'Error changing ad status' });
  }
});

module.exports = router;
