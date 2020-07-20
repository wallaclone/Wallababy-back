const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const webpush = require('web-push');

const User = require('../../models/User');

webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);

router.post('/', async function (req, res, next) {
    try {
        const subscription = req.body
        //const token = req.get('Authorization');
        //const tokenUser = jwt.verify(token, process.env.JWT_SECRET);
        /*await User.findByIdAndUpdate(tokenUser._id, {
            subscription
        })*/
        //res.status(200).json({'success': true})
    
        const payload = JSON.stringify({
        title: 'Hello!',
        body: 'It works.',
        })
        webpush.sendNotification(subscription, payload)
            .then(result => console.log(result))
            .catch(e => console.log(e))
    
        res.status(200).json({'success': true})
    } catch (error) { next(error); }
    
});

module.exports = router;
