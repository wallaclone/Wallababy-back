const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  name: String,
});

tagSchema.statics.list = async function () {
  const tags = await Tag.find();

  return tags;
};

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
