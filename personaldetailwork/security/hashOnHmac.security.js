import { createHmac } from "node:crypto";

export function hash(message, secret) {
    return createHmac('sha256', secret).update(message).digest('hex');
};

