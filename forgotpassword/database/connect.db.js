import mongoose from "mongoose";
import {mongoDbUrl} from "../grpc/worker/mongoDbUrl.worker.js";

/**
 * 
 * @param {String} URI -This uri is the connection url to the database
 */


export async function connectDB() {
    try {
        const uri = await mongoDbUrl();
        const connection = mongoose.connect(uri.url);
        console.log("db is connected")
    } catch (error) {
        console.log("error in the connecting the data base",error.message);
        process.exit(-1);
    };
};