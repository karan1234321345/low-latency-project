import mongoose from "mongoose";

/**
 * 
 * @param {String} URI -This uri is the connection url to the database
 */


export async function connectDB(URI) {
    try {
        const connection = mongoose.connect(URI);
        console.log("db is connected")
    } catch (error) {
        console.log("error in the connecting the data base",error.message);
        process.exit(-1);
    };
};