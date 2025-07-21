import {grpcRedisConfig} from "./worker.grpc.js";

export async function redisConfig() {
    try {
        return await grpcRedisConfig();
    } catch (error) {
        return null;
    }
}