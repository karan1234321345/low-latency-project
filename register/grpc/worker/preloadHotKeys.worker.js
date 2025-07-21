import {grpcPreloadHotKeys} from "./worker.grpc.js";

export async function preloadHotKeys() {
    try {
        return await grpcPreloadHotKeys();
    } catch (error) {
        return null;
    }
}