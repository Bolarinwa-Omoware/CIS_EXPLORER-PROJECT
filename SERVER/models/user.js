var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    facebookId: String,
    role: {
        type: String,
        default: 'Ordinary User'
    }
});


User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);