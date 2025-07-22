import {config} from "dotenv";
import fastify from "fastify";
import {masterRoute} from "./routes/master.route.js";
import {connectDB} from "./database/connect.db.js";
import {kafkaConnect} from "./config/kafka.config.js";
import {loadEnv} from "./env/inject.env.js";
import {variable} from "./env/main.env.js";
import {connectRedis} from "./config/redis.config.js";
config();

const app = fastify();
const port = process.env.FASTIFY_REGISTER_SERVER_PORT || 3004;


;(async () => {
    try {
        await loadEnv();
        await connectDB(variable.mongoDbUrl);
        await kafkaConnect(variable.kafkaConfig);
        connectRedis(variable.redisConfig);
        app.register(masterRoute, { prefix: "/api/v1" });
        app.listen(
            {port},
            (err,address)=>{
                if (err) {
                    console.log("error in starting fastify",err.message);
                    process.exit(-1);
                };
                console.log(`server starting at ${address} and at localhost:${port}`);
            }
        )
    } catch (error) {
        console.log("error in the main index.js file",error.message);
        process.exit(-1);
    }
})();