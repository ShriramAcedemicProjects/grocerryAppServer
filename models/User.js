const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone:{
        type:Number,
        required:true
    },
    password: {
      type: String,
      required: true,
    },

    creationDate: {
        type: Date,
        default: Date.now,
      },
      modificationDate: {
        type: Date,
        default: Date.now,
      },
      creator: {
        type: String,
        default: "user",
      },
      ipAddress: {
        type: String,
      },
  
},{timestamps:true})

module.exports = mongoose.model("User",userSchema,"User");