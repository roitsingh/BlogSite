const mongoose = require('mongoose');
const validator = require('validator');
const passportLocalMongoose=require('passport-local-mongoose');
const { authenticate } = require('passport');
const Schema = mongoose.Schema;


const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
        },
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: (value) => {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email address.');
                }
            },
        },
        password: {
            type: String,
            minlength: 8,
        },
    }
);

UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User',UserSchema);