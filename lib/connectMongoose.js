'use strict';

const mongoose = require('mongoose');
const db = mongoose.connection;

mongoose.Promise = global.Promise;

db.on('error', function (err) {
    console.error('mongodb connection error:', err);
    process.exit(1);
})

db.once('open', function () {
    console.info('Connected to mongodb on', mongoose.connection.name);
})

mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useMongoClient: true,
})

console.log("mongoose conectado");

module.exports = db;