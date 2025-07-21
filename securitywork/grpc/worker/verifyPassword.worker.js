import {grpcVerifyPassword} from "./worker.grpc.js";

export async function verifyPassword(hashedPassword,password) {
    try {
        return await grpcVerifyPassword(password,hashedPassword);
    } catch (error) {
        console.log("error in the main handle function of the verify password",error.message);
        return null;
    }
}