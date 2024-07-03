const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    admin:{
        type: Boolean,
        default: false
    },
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true
    },
    skills:{
        type: String,
        required: true
    },
})

const User= mongoose.model("User",userSchema);

module.exports=User;