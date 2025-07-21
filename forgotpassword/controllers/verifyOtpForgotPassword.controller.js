import {customResponse, errorResponse} from "../helpers/Response.helper.js";
import {dataCache} from "../config/redis.config.js";
import {hash} from "../security/hashOnHmac.security.js";
import {hashPassword} from "../grpc/worker/hashpassword.worker.js";
import {LoginDetail} from "../schema/loginDetail.modle.js";
import {findLocation} from "../utils/findLocation.util.js";
import {User} from "../schema/user.modle.js";
import mongoose from "mongoose";
import {config} from "dotenv";
import jwt from "jsonwebtoken";
import {verifyHmac} from "../security/verifyOnHmac.security.js";
import {preloadHotKeys} from "../grpc/worker/preloadHotKeys.worker.js";
config();

const hmacKeys = {
    newVersion:"v2",
    oldVersion:"v1",
    v2:"helloBhai",
    v1:"helloBhai",
};

const accessTokenKey = {
    newVersion:"v2",
    oldVersion:"v1",
    v2:"helloBhai",
    v1:"helloBhai",
};

const refreshTokenKey = {
    newVersion:"v2",
    oldVersion:"v1",
    v2:"helloBhai",
    v1:"helloBhai",
};

export async function handleVerifyOtpForgotPassword(req,reply) {
    const session = await mongoose.startSession();
    try {
        const {deviceFingerPrint,otp,password,userId} = req.body;
        const stringData = await dataCache.get(`forgotPassword:${userId}`);
        if (!stringData) {
            return customResponse(reply,404,"user not found",{reset:false});
        }
        const data = JSON.parse(stringData);
        const deviceData = data.devicehash.split(":");
        let keyVersion = deviceData[0];
        let recivedHmac = deviceData[1];
        let key;
        if (keyVersion !== hmacKeys.newVersion && keyVersion !== hmacKeys.oldVersion) {
            return customResponse(reply,403,"invalid devicehash detected",{reset:false});
        };
        if (keyVersion === hmacKeys.oldVersion) {
            key = hmacKeys[hmacKeys.oldVersion];
        } else {
            key = hmacKeys[hmacKeys.newVersion];
        };
        const compare = verifyHmac(key,deviceFingerPrint,recivedHmac);
        if (!compare) {
            return customResponse(reply,401,"invalid device detected",{reset:false});
        }
        if (data.otp !== otp) {
            return customResponse(reply,400,"wrong otp is entered",{reset:false});
        }
        session.startTransaction();
        if (keyVersion !== hmacKeys.newVersion) {
            recivedHmac = hash(deviceFingerPrint,hmacKeys.newVersion);
        }
        const ip = req.ip === '::1' || req.ip === '127.0.0.1' ? '8.8.8.8' : req.ip; // fallback to public IP for local testing
        const location = await findLocation(ip);
        if (!location) {
            throw new Error("Location lookup failed");
        };
        const hashing = await hashPassword(password);
        if (!hashing || Object.keys(hashing).length === 0) {
            return errorResponse(reply);
        };
        const hashedPassword = hashing.hashedPassword;
        const user = await User.findOneAndUpdate(
            {userId},
            {$set: {hashedPassword:hashedPassword}},
            {new:true, session}
        );
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            console.log("error in updating user in db")
            return errorResponse(reply);
        }
        const loginsaveArr = await LoginDetail.create(
            [{userId, location, ipAddress: req.ip, deviceHash:`${hmacKeys.newVersion}:${recivedHmac}`}],
            { session }
        );
        const loginsave = loginsaveArr[0];
        if (!loginsave) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(reply);
        }
        await dataCache.del(`forgotPassword:${userId}`);
        await session.commitTransaction();
        session.endSession();
        await dataCache.set(`user:${userId}`,JSON.stringify(user));
        const accessToken = jwt.sign({devicehash:`${hmacKeys.newVersion}:${recivedHmac}`,userId:userId},accessTokenKey[accessTokenKey.newVersion],{expiresIn:"30d"});
        const refreshToken = jwt.sign({devicehash:`${hmacKeys.newVersion}:${recivedHmac}`,name:user.name,profileImage:user.profileImage,userId:userId},refreshTokenKey[refreshTokenKey.newVersion],{expiresIn:"180d"});
        return customResponse(reply, 200, "Password reset successful", {reset: true,accessToken:`${accessTokenKey.newVersion}:${accessToken}`,refreshToken:`${refreshTokenKey.newVersion}:${refreshToken}`});
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log("error in the main handle function of the verify otp forgot password",error.message);
        return errorResponse(reply);
    };
};