//Require Mongoose
let mongoose = require('mongoose');

//Define a schema
let UserSchema = mongoose.Schema({
    name: String,
    access_token: String,
    page_id: String,
    page_access_token: String
});


let User = module.exports = mongoose.model('User', UserSchema);