import {startServer} from "./server/argon.server.js";
import {config} from "dotenv";
config();

const argon2GrpcServerURL = process.env.GRPC_ARGON2_SERVER_URL || "0.0.0.0:50000";

;(
    (url)=>{
        startServer(url);
    }
)(argon2GrpcServerURL);