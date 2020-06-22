'use strict';

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs-extra');

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

advertSchema.methods.setFoto = async function (file) {
    if (!file) return
    const dstPath = path.join(__dirname, '../public/images', file.originalname);
    //await fs.copy(file.path, dstPath);
    this.image = file.originalname;
}

const Advertisement = mongoose.model('Advertisement', advertSchema);

module.exports = Advertisement;
