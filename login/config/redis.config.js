import Redis from "ioredis";
import {config} from "dotenv";
config();

const host = process.env.REDIS_HOST || "localhost";
const port = process.env.REDIS_PORT || 6379;
const username = process.env.REDIS_USER_NAME;
const password = process.env.REDIS_PASSWORD;

export const dataCache = new Redis(port);