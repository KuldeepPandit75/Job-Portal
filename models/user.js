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
    }
})

const User= mongoose.model("User",userSchema);

module.exports=User;