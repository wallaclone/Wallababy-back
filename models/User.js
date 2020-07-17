const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const jwt = require('jsonwebtoken');

const fs = require('fs');

const emailTemplate = Handlebars.compile(fs.readFileSync('./views/email.handlebars').toString());

const emailTemplateES = Handlebars.compile(fs.readFileSync('./views/emailES.handlebars').toString());

const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema({
  username: {
    type: String, unique: true, index: true, required: true, validate: validator,
  },
  email: {
    type: String, unique: true, index: true, required: true, ref: 'Advertisement'
  },
  password: { type: String, required: true },
  favorites: [{ type: ObjectId, ref: 'Advertisement' }],
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

const User = mongoose.model('User', userSchema);

module.exports = User;
