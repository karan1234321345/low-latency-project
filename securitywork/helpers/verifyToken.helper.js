import jwt from "jsonwebtoken";
export function verifyToken(token,key) {
    try {
        const payload = jwt.verify(token,key);
        return payload;
        
    } catch (error) {
        return false;
    }
}