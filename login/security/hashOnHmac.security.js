import { createHmac } from "node:crypto";

export function hash(message, secret) {
    if (typeof message !== "string" || !message) {
        throw new TypeError("hash: message must be a non-empty string");
    }
    return createHmac('sha256', secret).update(message).digest('hex');
};

