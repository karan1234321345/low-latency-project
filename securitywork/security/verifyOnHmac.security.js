import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyHmac(secret, message, receivedHmac) {
    const expectedHmac = createHmac('sha256', secret).update(message).digest();
    let actual;
    try {
        actual = Buffer.from(receivedHmac, 'hex');
    } catch {
        return false; 
    };
    if (actual.length !== expectedHmac.length) return false;
    try {
        return timingSafeEqual(expectedHmac, actual); // ✅ true if matches
    } catch {
        return false;
    };
};
