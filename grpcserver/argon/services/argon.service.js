import argon from "argon2";

export const services = {
    hashPassword:async (call,callback) => {
        try {
            const {password} = call.request;
            const hashedPassword = await argon.hash(password);
            return callback(null,{hashedPassword});
        } catch (error) {
            console.log("error in the main function of the hash password",error.message);
            return callback({message:"internal server error"});
        }
    },
    verifyPassword: async (call,callback) => {
        try {
            const {hashedPassword,password} = call.request;
            const matched = await argon.verify(hashedPassword,password);
            return callback(null,{matched});
        } catch (error) {
            console.log("error in the main function of the verify password",error.message);
            return callback({message:"internal server error"})
        }
    }
};