export function checkToken(req) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return false;
        };
        const token = authHeader.split(' ')[1];
        return token

    } catch (error) {
        return false;
    }
}