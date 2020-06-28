'use strict';

const jwt = require('jsonwebtoken');

module.exports = function () {
    return function (req, res, next) {
        const token = req.get('Authorization') || req.body.token || req.query.token;
        //req.cookies.token
        if (!token) {
            return res.status(403).json('No token provided');
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err){
                return (next(err));
            }
            req.userId = decoded._id;
            next();
        })
    }
}