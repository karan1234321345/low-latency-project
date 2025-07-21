import {grpcHashPassword} from "./worker.grpc.js";

export async function hashPassword(password) {
    try {
        return await grpcHashPassword(password);
    } catch (error) {
        return null;
    }
}