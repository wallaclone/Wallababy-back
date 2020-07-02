const router = require('express').Router();
const Advert = require('../../models/Advertisement');
const User = require('../../models/User');

/* Add ad to user's favorites list */

router.post('/', async (req, res, next) => {
  const { advert_id } = req.body;
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    const isFavved = user.favorites.includes(advert_id);
    if (!isFavved) {
      const userUpdated = await User.findByIdAndUpdate(
        user._id,
        { $push: { favorites: advert_id } },
        { new: true }
      );
      return res.json({ message: 'Ad added to fav list', userUpdated });
    }

    return res.status(400).json({ message: 'This ad is already in favorites list' });
  } catch (error) {
    console.log('Error adding a favorite ad to favorites list', error);
    return res.status(500).json({ message: 'Error adding favorite ad to favorites list' });
  }
});

/* Remove ad from favorites list */

router.delete('/:id', async (req, res, next) => {
  const advert_id = req.params.id;

  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const isFavved = user.favorites.includes(advert_id);
    console.log(isFavved)
    if (isFavved) {
        await User.findByIdAndUpdate(user._id,
        { $pull: { favorites: advert_id } },
        { deleted: true}
      );
      return res.json({ message: 'Ad removed from favorite list' });
    }

    return res.status(400).json({ message: 'This ad was not in your favorite list' });
  } catch (error) {
    console.log('Error removing ad from favorite list', error);
    return res.status(500).json({ message: 'Error removing favorite ad from favorites list' });
  }
});


/* Show user's favorites list */
router.get('/', async function(req, res, next) {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate('Fav Ads');
    
    res.status(201).json(user.favorites);

  } catch (error) {
    console.log('Error showing fav list', error);
    return res.status(500).json({ message: 'Error showing fav list' });
   }
});

module.exports = router;
