'use strict';

const mongoose = require('mongoose');

const advertSchema = mongoose.Schema({
    name: String,
    description: String,
    image: String,
    status: Boolean,
    price: Number,
    owner: String,
    tags: [String],
    date_creation: Date,
});

advertSchema.statics.list = async function(limit, sortField) {
    const query = Advertisement.find();
    query.sort(sortField);
    query.limit(limit);

    const result = {};
    result.rows = await query.exec();
    return result;
}

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

advertSchema.methods.setFoto = async function (file) {
    if (!file) return
    const currentDate = currentDateFormatted();
    //const dstPath = path.join(__dirname, '../public/images', file.originalname);
    //await fs.copy(file.path, dstPath);
    this.image = currentDate + file.originalname;
}

const Advertisement = mongoose.model('Advertisement', advertSchema);

module.exports = Advertisement;
