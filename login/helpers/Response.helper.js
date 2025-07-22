export function errorResponse(reply,message="internal server error") {
    return reply.status(500).send({message:message,data:null});
};

export function insufficientDataResponse(reply) {
    return reply.status(400).send({message:"data is insufficient",data:null})
};


export function successResponse(reply,data) {
    return reply.status(200).status({message:"success",data:data})
};

export function customResponse(reply,status,message,data) {
    return reply.status(status).send({message:message,data:data})
};