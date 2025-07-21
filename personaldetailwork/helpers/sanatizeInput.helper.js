export function sanatizeInput(input) {
    if (!input) {
        return false;
    };
    if (input.trim().length ===0) {
        return false
    };
    return input.trim().toLowerCase();
}