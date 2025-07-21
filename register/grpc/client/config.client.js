import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import {fileURLToPath} from "url";
import {config} from "dotenv";
import path from "path";
config();


const url = process.env.GRPC_KEY_MANAGEMENT_SERVER_URL || "localhost:50001";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageDefination = protoLoader.loadSync(
    path.join(__dirname,"../../proto/config.proto"),{}
);
const proto = grpc.loadPackageDefinition(packageDefination);
export const configClient = new proto.configManagement.v1.ConfigManagementService(url,grpc.credentials.createInsecure());