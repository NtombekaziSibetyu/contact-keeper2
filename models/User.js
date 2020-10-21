const mongoose = require("mongoose");
//create usser model
const UserSchema = mongoose.Schema({
    name : {
        type :  String,
        required : true
    },
    email : {
        type :  String,
        required : true,
        unique : true
    },
    password : {
        type :  String,
        required : true
    },
    role:{
        type : String,
        default : "partner"
    },
    date : {
        type :  Date,
        default : Date.now()
    },
});

module.exports = mongoose.model('user', UserSchema)