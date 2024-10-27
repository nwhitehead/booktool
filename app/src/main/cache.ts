
function same(args0, args1) {
    return JSON.stringify(args0) === JSON.stringify(args1);
}

export function cacheFunction(f) {
    let cacheValue, cacheKey;
    async function call(...args) {
        if (same(cacheKey, args)) {
            return cacheValue;
        }
        cacheKey = args;
        cacheValue = await f(...args);
        return cacheValue;
    }
    return call;
}
