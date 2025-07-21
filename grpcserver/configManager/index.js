import {config} from "dotenv";
import {startServer} from "./server/config.server.js";
config();

const url = process.env.GRPC_CONFIG_MANAGEMENT_SERVER_URL || "0.0.0.0:50001";

;(
    (url)=>{
        try {
            startServer(url);
        } catch (error) {
            console.log("error in the index file",error.message);
        };
    }
)(url)