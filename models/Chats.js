const mongoose = require('mongoose');

const ObjectId = require('mongodb').ObjectID;


const chatSchema = mongoose.Schema({
        owner: { type: String, ref: 'User', required: true },
        advert: { type: ObjectId, ref: 'Advertisement', required: true },
        sender: { type: String, ref: 'User', required: true }, 
})
;

chatSchema.index({ sender: 1, advert: 1 }, { unique: true });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;