const CACHE_TTL = 3600 * 1000; // 1 hour
const cache = new Map();

/**
 * Get data from cache
 * @param {string} key
 * @returns {any | null}
 */
export function getCache(key) {
    const entry = cache.get(key);
    if (entry && Date.now() - entry.time < CACHE_TTL) {
        return entry.data;
    }
    return null;
}

/**
 * Set data in cache
 * @param {string} key
 * @param {any} data
 */
export function setCache(key, data) {
    cache.set(key, { time: Date.now(), data });
}

/**
 * Clear cache for given keys
 * @param {string[]} keys
 */
export function clearCache(keys = []) {
    keys.forEach((k) => cache.delete(k));
}

/**
 * Get common cache headers
 */
export const cacheHeaders = {
    "Cache-Control": "s-maxage=3600, stale-while-revalidate=59",
    "Content-Type": "application/json",
};

export const CACHE_DURATION_SECONDS = 3600;