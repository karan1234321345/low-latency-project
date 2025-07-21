import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userId:{
            type:String,
            required:true,
            unique:true,
        },
        name:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
        },
        mail:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
        },
        hashedPhoneNo:{
            type:String,
        },
        dob:{
            type:String,
        },
        profileImage:{
            type:String,
        },
        tfa:{
            type:Boolean,
            default:false,
        },
        hashedSecurityKey:{
            type:String,
        },
        hashedPassword:{
            type:String,
        },
        accountBasedOn:{
            type:String,
            required:true,
            lowercase:true,
            trim:true,
        },
    },
    {
        timestamps:true,
    }
);

export const User = mongoose.model("User",userSchema);