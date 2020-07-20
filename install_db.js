require('dotenv').config();
const Advertisement = require('./models/Advertisement');
const Users = require('./models/User');
const Tags = require('./models/Tags');
const db = require('./lib/connectMongoose');

db.once('open', async () => {
  try {
    await initAdverts();
    await initUsers();
    await initTags();
    db.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

async function initAdverts(cb) {
  const adsFile = require('./json/adverts.json');
  await Advertisement.deleteMany();
  await Advertisement.insertMany(adsFile);
}

async function initUsers() {
  await Users.deleteMany();
  await Users.insertMany([
      {
          username: "SergioPC",
          email: 'sergio.wallababy@gmail.com',
          password: await Users.hashPassword('1234')
      },
      {
          username: 'GonzaloLR',
          email: 'gonzalo.wallababy@gmail.com',
          password: await Users.hashPassword('1234')
      },
      {
          username: 'GemaSB',
          email: 'gema.wallababy@gmail.com',
          password: await Users.hashPassword('1234')
      }
  ]);
}

async function initTags() {
  const tagsFile = require('./json/tags.json');
  await Tags.deleteMany();
  await Tags.insertMany(tagsFile);
}
