const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const webpush = require('web-push');

const User = require('../../models/User');

webpush.setVapidDetails('mailto:wallaclonesuport@gmail.com', process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);

router.post('/', async function (req, res, next) {
    try {
        const subscription = req.body
        const token = req.get('Authorization');
        const tokenUser = jwt.verify(token, process.env.JWT_SECRET);
        
        await User.findOneAndUpdate({_id: tokenUser._id}, {subscription: subscription},{strict: false})
        res.status(200).json({'success': true})
    } catch (error) { next(error); }
    
});

module.exports = router;
