export const services = {
    preloadHotKeys: async (call, callback) => {
        try {
            const newRefreshTokenKey = "v2:helloBhai";
            const oldRefreshTokenKey = "v1:helloBhai";
            const newAccessTokenKey = "v2:helloBhai";
            const oldAccessTokenKey = "v1:helloBhai";
            const newHmacSecretKey = "v2:helloBhai";
            const oldHmacSecretKey = "v1:helloBhai";
            return callback(
                null,
                {
                    newAccessTokenKey,
                    oldAccessTokenKey,
                    newRefreshTokenKey,
                    oldRefreshTokenKey,
                    newHmacSecretKey,
                    oldHmacSecretKey,
                }
            )
        } catch (error) {
            console.log("error in the main handle function of the preloadHotKeys", error.message);
            callback(
                {
                    code: 13,
                    message: error.message,
                }
            )
        }
    },
    mongoDbUrl:async (call,callback) => {
        try {
            const dbUrl = "mongodb+srv://karan1234:IfaKOAFO4caFGwg3@cluster0.teulk.mongodb.net/?retryWrites=true&w=majority&appName=chilandu";
            return callback(
                null,
                {
                    url: dbUrl,
                }
            )
        } catch (error) {
            console.log("error in the main handle function of the mongo db url",error.message);
            return callback(
                {
                    code:13,
                    message:error.message,
                }
            )
        }
    },
    redisConfig:async (call,callback) => {
        try {
            const config = {
                port:6379,
                host: "localhost",
                username:"",
                password:"",
            };
            return callback(
                null,
                {
                    host:config.host,
                    port: config.port,
                    username: config.username,
                    password: config.password,
                }
            )
        } catch (error) {
            console.log("error in tha main hndle function of the redis config",error.message);
            return callback(
                {
                    code:13,
                    message: error.message,
                }
            )
        }
    },
    kafkaConfig:async (call,callback) => {
        try {
            const data = {
                clientId:"send-otp-producer",
                brokers:["localhost:19092"],
            };
            return callback(null,{clientId:data.clientId,brokers:data.brokers}) }
             catch (error) {
            console.log("error in the main async handler funcction of the kafka config in grpc",error.message);
            return callback(
                {
                    code:13,
                    message: error.message,
                }
            )
        }
    }
};