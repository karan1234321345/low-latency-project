import { argonClient } from "../client/argon.client.js";
import {configClient} from "../client/config.client.js";
export function grpcHashPassword(password) {
    return new Promise(
        (resolve, reject) => {
            try {
                argonClient.hashPassword(
                    { password },
                    (err, res) => {
                        if (err) {
                            console.log("error is coming from the grpc server", err.message);
                            return reject(
                                {
                                    code: 13,
                                    message: err.message,
                                }
                            );
                        };
                        if (Object.keys(res).length === 0) {
                            console.log("empty response is coming from the grpc");
                            return reject(
                                {
                                    code: 13,
                                    message: "empty response is coming from the grpc",
                                }
                            );
                        };
                        return resolve(res);
                    }
                )
            } catch (error) {
                console.log("error in the function of the grpc hashPassword", error.message);
                return reject(
                    {
                        code: 13,
                        message: error.message,
                    }
                );
            };
        },
    );
};


export function grpcVerifyPassword(password, hashedPassword) {
    return new Promise(
        (resolve, reject) => {
            try {
                argonClient.verifyPassword(
                    { password, hashedPassword },
                    (err, res) => {
                        if (err) {
                            console.log("error is coming from the grpc server", err.message);
                            return reject(
                                {
                                    code: 13,
                                    message: err.message,
                                }
                            );
                        };
                        if (Object.keys(res).length === 0) {
                            console.log("empty response is coming from the grpc");
                            return reject(
                                {
                                    code: 13,
                                    message: "empty response is coming from the grpc",
                                }
                            );
                        };
                        return resolve(res);
                    }
                )
            } catch (error) {
                console.log("error in the function of the grpc verifyPassword", error.message);
                return reject(
                    {
                        code: 13,
                        message: error.message,
                    }
                );
            };
        },
    );
};

export function grpcPreloadHotKeys() {
    return new Promise(
        (resolve, reject) => {
            try {
                configClient.preloadHotKeys(
                    {},
                    (err,res)=>{
                        if (err) {
                            console.log("error is coming from the grpc server",err.message);
                            return reject(
                                {
                                    code:13,
                                    message:err.message,
                                }
                            )
                        }
                        if (Object.keys(res).length === 0) {
                            console.log("empty response is coming from the grpc server");
                            return reject(
                                {
                                    code:13,
                                    message:"empty response is coming from the grpc",
                                }
                            );
                        };
                        return resolve(res);
                    }
                )
            } catch (error) {
                console.log("error in the main client function of the preload hot key grpc", error.message);
                return reject(
                    {
                        code:13,
                        message: error.message,
                    }
                )
            }
        }
    )
};

export function grpcKeyByVersion(version) {
    return new Promise(
        (resolve, reject) => {
            try {
                configClient.keyByVersion(
                    {version},
                    (err,res)=>{
                        if (err) {
                            console.log("error is coming from the grpc server",err.message);
                            return reject(
                                {
                                    code:13,
                                    message:err.message,
                                }
                            )
                        }
                        if (Object.keys(res).length === 0) {
                            console.log("empty response is coming from the grpc server");
                            return reject(
                                {
                                    code:13,
                                    message:"empty response is coming from the grpc",
                                }
                            );
                        };
                        return resolve(res);
                    }
                )
            } catch (error) {
                console.log("error in the main client function of the preload hot key grpc", error.message);
                return reject(
                    {
                        code:13,
                        message: error.message,
                    }
                )
            }
        }
    )
};

export function grpcMongoDbUrl() {
    return new Promise(
        (resolve, reject) => {
            try {
                configClient.mongoDbUrl(
                    {},
                    (err,res)=>{
                        if (err) {
                            console.log("error is coming from the grpc server",err.message);
                            return reject(
                                {
                                    code:13,
                                    message:err.message,
                                }
                            )
                        }
                        if (Object.keys(res).length === 0) {
                            console.log("empty response is coming from the grpc server");
                            return reject(
                                {
                                    code:13,
                                    message:"empty response is coming from the grpc",
                                }
                            );
                        };
                        return resolve(res);
                    }
                )
            } catch (error) {
                console.log("error in the main client function of the preload hot key grpc", error.message);
                return reject(
                    {
                        code:13,
                        message: error.message,
                    }
                )
            }
        }
    )
};

export function grpcRedisConfig() {
    return new Promise(
        (resolve, reject) => {
            try {
                configClient.redisConfig(
                    {},
                    (err,res)=>{
                        if (err) {
                            console.log("error is coming from the grpc server",err.message);
                            return reject(
                                {
                                    code:13,
                                    message:err.message,
                                }
                            )
                        }
                        if (Object.keys(res).length === 0) {
                            console.log("empty response is coming from the grpc server");
                            return reject(
                                {
                                    code:13,
                                    message:"empty response is coming from the grpc",
                                }
                            );
                        };
                        return resolve(res);
                    }
                )
            } catch (error) {
                console.log("error in the main client function of the preload hot key grpc", error.message);
                return reject(
                    {
                        code:13,
                        message: error.message,
                    }
                )
            }
        }
    )
}