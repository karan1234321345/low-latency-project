import {config} from "dotenv";
import fastify from "fastify";
import {masterRoute} from "./routes/master.route.js";
import {connectDB} from "./database/connect.db.js";
config();

const app = fastify();


const port = process.env.PORT || 3003;
const uri = process.env.MONGO_URI || "mongodb+srv://karan1234:IfaKOAFO4caFGwg3@cluster0.teulk.mongodb.net/?retryWrites=true&w=majority&appName=chilandu";
const REDIS_URI = process.env.REDIS_PORT || "redis://localhost:6379";

(async (uri) => {
    try {
        await connectDB(uri);
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
})(uri);