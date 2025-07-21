import {errorResponse,customResponse,successResponse} from "../helpers/Response.helper.js";
import {LoginDetail} from "../schema/loginDetail.modle.js";
import {User} from "../schema/user.modle.js";
import {getDataCache} from "../config/redis.config.js";
import {verifyHmac} from "../security/verifyOnHmac.security.js";
import mongoose from "mongoose";
import {hashPassword} from "../grpc/worker/hashpassword.worker.js";
import {findLocation} from "../utils/findLocation.util.js";
import jwt from "jsonwebtoken";
import { hash } from "../security/hashOnHmac.security.js";
import {variable} from "../env/main.env.js";

export async function handleVerifyOtpRegister(req,reply) {
    const session = await mongoose.startSession();
    try {
        const hmacKeys = variable.hmacKeys;
        const accessTokenKeys =  variable.accessTokenKeys;
        const refreshTokenKeys = variable.refreshTokenKeys;
        const dataCache = getDataCache()
        const {userId,otp,deviceFingerPrint} = req.body;
        const stringData = await dataCache.get(`register:${userId}`);
        if (!stringData) {
            return customResponse(reply,403,"OTP expired or invalid userId",{registered:false});
        };
        const data = JSON.parse(stringData);
        const deviceData = data.devicehash.split(":");
        const hmacKeyVersion = deviceData[0];
        let recivedHmac = deviceData[1];
        let hmacSecretKey;
        if (hmacKeyVersion !== hmacKeys.newKeyVersion && hmacKeys.oldKeyVersion !== hmacKeyVersion) {
            return customResponse(reply,403,"hmac version is invalid",{registered:false});
        };
        if (hmacKeyVersion === hmacKeys.newKeyVersion) {
            hmacSecretKey = hmacKeys[hmacKeys.newKeyVersion];
        } else {
            hmacSecretKey = hmacKeys[hmacKeys.oldKeyVersion];
        }
        const compare = verifyHmac(hmacSecretKey,deviceFingerPrint,recivedHmac);
        if (!compare) {
            return customResponse(reply,402,"unauthorized userId",{registered:false});
        };
        if (data.otp !== otp) {
            return customResponse(reply,400,"wrong otp",{registered:false});
        };
        const ip = req.ip === '::1' || req.ip === '127.0.0.1' ? '8.8.8.8' : req.ip; 
        const location = await findLocation(ip);
        if (!location) {
            throw new Error("Location lookup failed");
        };
        const country = location.split("-")[2];
        const hashing = await hashPassword(data.password);
        if (!hashing || Object.keys(hashing).length === 0) {
            return errorResponse(reply);
        }
        const hashedPassword = hashing.hashedPassword;
        session.startTransaction();
        try {
            const newUser = new User({
                userId,
                name: data.name,
                mail: data.mail,
                dob: data.dob,
                hashedPassword: hashedPassword,
                accountBasedOn: country,
            });
            await newUser.save({ session });
            const loginDetail = new LoginDetail({
                deviceHash: data.devicehash,
                userId: userId,
                ipAddress: req.ip,
                location: location,
            });
            if (hmacKeyVersion !== hmacKeys.newKeyVersion) {
                recivedHmac = hash(deviceFingerPrint,hmacKeys[hmacKeys.newKeyVersion]);
            };
            await loginDetail.save({ session });
            await session.commitTransaction();
            await dataCache.del(`register:${userId}`);
            session.endSession();
            await dataCache.set(`user:${userId}`,JSON.stringify(newUser));
            const accessToken = jwt.sign({devicehash:`${hmacKeys.newKeyVersion}:${recivedHmac}`,userId:userId},accessTokenKeys[accessTokenKeys.newKeyVersion],{expiresIn:"30d"});
            const refreshToken = jwt.sign({devicehash:`${hmacKeys.newKeyVersion}:${recivedHmac}`,name:data.name,profileImage:null,userId:userId},refreshTokenKeys[refreshTokenKeys.newKeyVersion],{expiresIn:"180d"});
            return successResponse(reply, { registered: true,accessToken:`${accessTokenKeys.newKeyVersion}:${accessToken}`,refreshToken:`${refreshTokenKeys.newKeyVersion}:${refreshToken}`});
        } catch (err) {
            console.log(err.message);
            await session.abortTransaction();
            session.endSession();
            return errorResponse(reply);
        };
    } catch (error) {
        return errorResponse(reply);
    };
};