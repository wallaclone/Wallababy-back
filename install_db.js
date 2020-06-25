'use strict';

require('dotenv').config();
const Advertisement = require('./models/Advertisement');
const Users = require('./models/User');
const db = require('./lib/connectMongoose');

db.once('open', async function () {
    try {
        await initAdverts();
        await initUsers();
        db.close();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})

async function initAdverts(cb) {
    const adsFile = require('./adverts.json');
    await Advertisement.deleteMany();
    await Advertisement.insertMany(adsFile);
}

async function initUsers() {
    await Users.deleteMany();
    await Users.insertMany([
        {
            username: "firstuser",
            email: 'firstuser@hotmail.com',
            password: await Users.hashPassword('theFirst123')
        },
        {
            username: 'usertest',
            email: 'usertest@hotmail.com',
            password: await Users.hashPassword('userTest123')
        }
    ]);
} 