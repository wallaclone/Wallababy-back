'use strict';

const jwt = require('jsonwebtoken');

module.exports = function () {
    return function (req, res, next) {
        const token = req.get('Authorization') || req.cookies.token || req.body.token || req.query.token;

        if (!token) {
            const error = new Error('No token provided');
            error.status = 401;
            return next(error);
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