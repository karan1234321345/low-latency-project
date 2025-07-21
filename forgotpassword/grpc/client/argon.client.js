import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import {fileURLToPath} from "url";
import {config} from "dotenv";
import path from "path";
config();
const url = process.env.GRPC_ARGON2_SERVER_URL || "0.0.0.0:50000";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageDefination = protoLoader.loadSync(
    path.join(__dirname,"../../proto/argon.proto"),{}
);
const proto = grpc.loadPackageDefinition(packageDefination);
export const argonClient = new proto.argon.v1.ArgonService(url,grpc.credentials.createInsecure());