import {verifyHmac} from "../security/verifyOnHmac.security.js";
export function verifyDevicehash(deviceFingerPrint,devicehash,keys) {
    try {
        const hmacData = devicehash.split(":");
        const keyVersion = hmacData[0];
        const recivedHmac = hmacData[1];
        if (keyVersion !== keys.newKeyVersion && keyVersion !== keys.oldVersion) {
            return {status:false,message:"invalid key version"};
        };
        const key = keys[keys[keyVersion]];
        const verify = verifyHmac(key,deviceFingerPrint,recivedHmac);
        if (!verify) {
            return {status:false,message:"invalid token"};
        };
        return {status:true,message:"success"};
    } catch (error) {
        console.log("error in the verify device hash",error.message);
        return {status:false,message:"internal server error"};
    }
}