import {kafkaConfig} from "./worker.grpc.js";


export async function grpcKafkaConfig() {
    try {
        return await kafkaConfig();
    } catch (error) {
        console.log("error in the calling fuction of the grpc kafka config",error.message);
        return false;
    };
};