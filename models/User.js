const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { ObjectId } = mongoose.Schema.Types;

const Advertisement = require('./Advertisement');
const emailTemplate = Handlebars.compile(fs.readFileSync('./views/email.handlebars').toString());
const emailTemplateES = Handlebars.compile(fs.readFileSync('./views/emailES.handlebars').toString());
const emailTemplateWTB = Handlebars.compile(fs.readFileSync('./views/emailWTB.handlebars').toString());
const emailTemplateWTBES = Handlebars.compile(fs.readFileSync('./views/emailWTBES.handlebars').toString());

const userSchema = mongoose.Schema({
  username: {
    type: String, unique: true, index: true, required: true, validate: validator,
  },
  email: {
    type: String, unique: true, index: true, required: true, ref: 'Advertisement'
  },
  password: { type: String, required: true },
  favorites: [{ type: ObjectId, ref: 'Advertisement' }],
  subscription: { type: mongoose.Schema.Types.Mixed, index: true },
});

function validator (username) {
  if (username === 'guest') {
    return false} 
    return;
}

userSchema.statics.hashPassword = function (plainPassword) {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(plainPassword, salt);
};

userSchema.statics.recoverPassword = async function (email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('The email doesn`t exists');
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.WALLACLONE_EMAIL,
      pass: process.env.WALLACLONE_PASS,
    },
  });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  const info = await transporter.sendMail({
    from: process.env.WALLACLONE_EMAIL,
    to: email,
    tls: {
      rejectUnauthorized: false,
    },
    subject: 'WallaBaby: Reset password!',
    html: emailTemplate({
      username: user.username,
      id: user._id,
      token,
    }),
  });
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  console.log('message sent: ', info);
};

userSchema.statics.recoverPasswordEs = async function (email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('The email doesn`t exists');
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.WALLACLONE_EMAIL,
      pass: process.env.WALLACLONE_PASS,
    },
  });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  const info = await transporter.sendMail({
    from: process.env.WALLACLONE_EMAIL,
    to: email,
    tls: {
      rejectUnauthorized: false,
    },
    subject: 'WallaBaby: Restablecer contraseña',
    html: emailTemplateES({
      username: user.username,
      id: user._id,
      token,
    }),
  });
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  console.log('message sent: ', info);
};

userSchema.statics.contactUser = async function (email, sender, adId) {
  const user = await User.findOne({email})
  const user2 = await User.findOne({username: sender})
  const destination = user.email;
  const ad = await Advertisement.findById(adId)
  if (!user) {
    throw new Error('The email doesn`t exists');
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.WALLACLONE_EMAIL,
      pass: process.env.WALLACLONE_PASS,
    },
  });


  const info = await transporter.sendMail({
    from: process.env.WALLACLONE_EMAIL,
    to: destination,
    tls: {
      rejectUnauthorized: false,
    },
    subject: `I'm interested in your ad ${ad.name}!`,
    html: emailTemplateWTB({
      username: user.username,
      sender: user2.username,
      senderMail: user2.email,
      adName: ad.name,
    }),
  });
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  console.log('message sent: ', info);
};

userSchema.statics.contactUserES = async function (email, sender, adId) {
  const user = await User.findOne({email})
  const user2 = await User.findOne({username: sender})
  const destination = user.email;
  const ad = await Advertisement.findById(adId)
  if (!user) {
    throw new Error('The email doesn`t exists');
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.WALLACLONE_EMAIL,
      pass: process.env.WALLACLONE_PASS,
    },
  });


  const info = await transporter.sendMail({
    from: process.env.WALLACLONE_EMAIL,
    to: destination,
    tls: {
      rejectUnauthorized: false,
    },
    subject: `¡Me interesa tu anuncio ${ad.name}!`,
    html: emailTemplateWTBES({
      username: user.username,
      sender: user2.username,
      senderMail: user2.email,
      adName: ad.name,
    }),
  });
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  console.log('message sent: ', info);
};






const User = mongoose.model('User', userSchema);

module.exports = User;
