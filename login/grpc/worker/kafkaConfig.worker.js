import {grpcKafkaConfig} from "./worker.grpc.js";


export async function kafkaConfig() {
    try {
        return await grpcKafkaConfig();
    } catch (error) {
        console.log("error in the calling fuction of the grpc kafka config",error.message);
        return false;
    };
};