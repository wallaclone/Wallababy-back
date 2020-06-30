'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');

const fs = require('fs');
const emailTemplate = Handlebars.compile(fs.readFileSync('./views/email.handlebars').toString()
);

const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema({
    username: { type: String, unique: true, index: true, required: true },
    email: { type: String, unique: true, index: true, required: true },
    password: { type: String, required: true },
    favorites: [{ type: ObjectId, ref: 'Fav ads' }]
})

userSchema.statics.hashPassword = function (plainPassword) {
    const salt = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(plainPassword, salt);
}

userSchema.statics.recoverPassword = async function (email) {

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('The email doesn`t exists');
    }
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.WALLACLONE_EMAIL,
            pass: process.env.WALLACLONE_PASS,
        }
    })



    let info = await transporter.sendMail({
        from: process.env.WALLACLONE_EMAIL,
        to: email,
        tls: {
            rejectUnauthorized: false
        },
        subject: `Forgot Password`,
        html: emailTemplate({
            username: user.username,
            id: user._id
        }),
    });
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("message sent: ", info);
}

const User = mongoose.model('User', userSchema);

module.exports = User;