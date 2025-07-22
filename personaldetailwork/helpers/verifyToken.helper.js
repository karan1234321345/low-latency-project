import jwt from "jsonwebtoken";

export function verifyToken(token, keys) {
    try {
        if (!token || !token.includes(":")) return {status:false,data:{},message:"token not found"};
        const tokenData = token.split(":");
        const keyVersion = tokenData[0];
        if (keyVersion !== keys.newVersion && keyVersion !== keys.oldVersion) {
            return {status:false,data:{},message:"invalid token"};
        }
        const key = keys[keyVersion];
        const verify = jwt.verify(tokenData[1], key);
        return {status:true,data:verify,message:"success"};
    } catch (error) {
        console.log("error in verifyToken function", error.message);
        if (error.name === "TokenExpiredError") {
            return {status:false,data:{},message:`token expored at ${error.expiredAt}`};
        }
        return {status:false,data:{},message:"internal server error"};
    };
};
