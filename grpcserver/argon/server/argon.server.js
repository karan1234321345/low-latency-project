import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import {fileURLToPath} from "url";
import path from "path";
import {services} from "../services/argon.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageDefination = protoLoader.loadSync(
    path.join(__dirname,"../proto/argon.proto"),{}
);
const proto = grpc.loadPackageDefinition(packageDefination);

export function startServer(url) {
    try {
        const server = new grpc.Server();
        server.addService(proto.argon.v1.ArgonService.service, services);
        server.bindAsync(url,grpc.ServerCredentials.createInsecure(),(err,adress)=>{
            if (err) {
                console.log("error in the bind async",err.message);
                process.exit(-1);
            };
            console.log(`server started at ${adress}`)
        });
    } catch (error) {
        console.log("error in the start function of the grpc server",error.message);
        process.exit(-1);
    };
};