import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {type :String, require: true, unique: true},
    email : {type :String, require: true, unique: true},
    password : {type :String, require: true},
    profilePicture : {type : String , default : ' '},
    bio : {type : String, default : ' '},
    gender : {type : String, enum : [male, female]},
    followers : [{type : mongoose.Schema.Types.ObjectId, ref:'USer'}],
    following : [{type : mongoose.Schema.Types.ObjectId, ref:'USer'}],
    posts : [{type : mongoose.Schema.Types.ObjectId, ref : 'Post'}],
    bookmark : [{type : mongoose.Schema.Types.ObjectId, ref : 'Post'}]

})