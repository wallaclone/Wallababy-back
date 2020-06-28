'use strict';

const multer = require('multer');
const path = require('path');

const currentDateFormatted = () => {
    const dateObj = new Date();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    const newdate = year + '-' + month + '-' + day + '-' + hours + ':' + minutes + '_';
    return newdate; 
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function(req, file, cb) {
        const currentDate = currentDateFormatted();
        cb(null, currentDate + file.originalname);
    }
})

module.exports = multer({ storage: storage });