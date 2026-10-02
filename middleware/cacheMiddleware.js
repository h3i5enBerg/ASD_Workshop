const cache = {};
const TTL = 60000; // 1 minute TTL in milliseconds

function checkCache(key) {
    if (!cache[key]) {
        return null;
    }
    const currentTime = Date.now();
    const cacheAge = currentTime - cache[key].createdAt;
    if (cacheAge >= TTL) {
        delete cache[key];
        return null;
    }
    return cache[key].data;
}

function saveCache(key, data) {
    cache[key] = {
        data: data,
        createdAt: Date.now()
    };
}

function cacheMiddleware(req, res, next) {
    const key = req.originalUrl;
    const data = checkCache(key);
    if (data) {
        res.set('X-Cache', 'HIT');
        return res.json(data);
    }
    res.set('X-Cache', 'MISS');
    const originalJson = res.json;
    res.json = function (body) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            saveCache(key, body);
        }
        return originalJson.call(this, body);
    };
    next();
}

function clearCache() {
    Object.keys(cache).forEach((key) => {
        delete cache[key];
    });
}

module.exports = {
    checkCache,
    saveCache,
    clearCache,
    cacheMiddleware
};
