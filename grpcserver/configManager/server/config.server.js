import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import {fileURLToPath} from "url";
import path from "path";
import {services} from "../services/config.service.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageDefination = protoLoader.loadSync(
    path.join(__dirname,"../proto/config.proto"),{}
);
const proto = grpc.loadPackageDefinition(packageDefination);
export function startServer(url) {
    try {
        const server = new grpc.Server();
        server.addService(proto.configManagement.v1.ConfigManagementService.service,services);
        server.bindAsync(url,grpc.ServerCredentials.createInsecure(),(err,address)=>{
            if (err) {
                console.log(`error in the bind async of the grpc server`,err.message,err.cause);
                process.exit(-1);
            };
            console.log(`server running at ${address}`);
        });
    } catch (error) {
        console.log("error in the main starting function of thr grpc",error.message);
        process.exit(-1);
    };
};