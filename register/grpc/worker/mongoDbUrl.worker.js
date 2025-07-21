import {grpcMongoDbUrl} from "./worker.grpc.js";

export async function mongoDbUrl() {
    try {
        return await grpcMongoDbUrl();
    } catch (error) {
        return null;
    }
}