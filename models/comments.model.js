import mongoose from "mongoose";

const commmentSchema = new mongoose.Schema({
    text : {type:String, required : true},
    author : {type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true},
    post : {type : mongoose.Schema.Types.ObjectId, ref : 'Post', requireD : true}
})

export default Comments = mongoose.model('Comments', commmentSchema);