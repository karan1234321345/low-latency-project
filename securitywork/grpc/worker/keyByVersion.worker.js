import {grpcKeyByVersion} from "./worker.grpc.js";

export async function keyByVersion(version) {
    try {
        return await grpcKeyByVersion(version);
    } catch (error) {
        return null;
    };
};
