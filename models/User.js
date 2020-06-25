'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');

const userSchema = mongoose.Schema({
    username: { type: String, unique: true, index: true },
    email: {type: String, unique: true, index: true },
    password: String
})

userSchema.statics.hashPassword = function(plainPassword) {
    const salt = bcrypt.genSaltSync(10);
    
    return bcrypt.hashSync(plainPassword, salt);
}

userSchema.statics.recoverPassword = async function(email) {

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
        subject: `Forgot Password`,
        html: `
        <p>Someone requested that the password for your Wallaclone account be reset.</p>
        <p>Click <a href="http://localhost:3000/recoverpassword/?` + user.username + `">here</a> to reset your password</p>
        <p>If you didnt request this, you can ignore this email or let us know. Your password
        will not change until you create a new password</p>`
        
        
    });
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("message sent: ", info);
}

const User = mongoose.model('User', userSchema);

module.exports = User;