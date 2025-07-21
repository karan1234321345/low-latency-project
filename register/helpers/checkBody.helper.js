export function checkBody(req) {
    if (!req.body ||typeof req.body !== "object" || !Object.keys(req.body).length === 0) {
        return false;
    };
    return true;
}