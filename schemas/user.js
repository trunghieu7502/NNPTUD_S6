let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },password:{
        type:String,
        required:true
    },email:{
        type:String,
        required:true,
        unique:true
    },fullname:{
        type:String,
        default:""
    },avatarURL:{
        type:String,
        default:""
    },status:{
        type:Boolean,
        default: false
    },role:{
        type:mongoose.Types.ObjectId,
        ref:'role',
        required:true
    },loginCount:{
        type:Number,
        default:0,
        min:0
    },isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
module.exports = mongoose.model('user',userSchema)