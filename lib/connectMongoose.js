const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
const db = mongoose.connection;

mongoose.Promise = global.Promise;

db.on('error', (err) => {
  console.error('mongodb connection error:', err);
  process.exit(1);
});

db.once('open', () => {
  console.info('Connected to mongodb on', mongoose.connection.name);
});

mongoose.connect(process.env.DB_CONNECTION, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log('mongoose conectado');

module.exports = db;
