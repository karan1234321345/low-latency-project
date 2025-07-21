import {grpcPreloadHotKeys} from "./worker.grpc.js";

export async function preloadHotKeys() {
    try {
        await grpcPreloadHotKeys();
    } catch (error) {
        return null;
    }
}