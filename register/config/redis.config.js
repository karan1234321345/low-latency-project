import Redis from "ioredis";
let data;

export function connectRedis(configuration) {
    data = new Redis(configuration);
    console.log("redis connected");
}

export function getDataCache() {
    return data;
}