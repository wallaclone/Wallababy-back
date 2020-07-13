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
    reserved: { type: Boolean,  default: false},
    sold: { type: Boolean,  default: false }
});

advertSchema.statics.list = async function(filters, skip, limit, sortField) {
    const query = Advertisement.find(filters);
    query.sort(sortField);
    query.skip(skip);
    query.limit(limit);
    
    const result = {};
    result.rows = await query.exec();
    result.count = await query.count();
    return result;
}

const currentDateFormatted = () => {
    const dateObj = new Date();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    const newdate = year + '-' + month + '-' + day + '-' + hours + '_' + minutes + '_';
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
