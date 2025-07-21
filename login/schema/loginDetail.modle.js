import mongoose from "mongoose";
import { type } from "os";

const loginDetailSchema = new mongoose.Schema(
    {
        ipAddress:{
            type:String,
            required:true,
            lowercase:true,
            trim:true,
        },
        deviceHash:{
            type:String,
            required:true,
        },
        location:{
            type:String,
            required:true,
            lowercase:true,
            trim:true,
        },
        userId:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
        },
    },
    {
        timestamps:true,
    }
);

export const LoginDetail = mongoose.model("LoginDetail",loginDetailSchema)